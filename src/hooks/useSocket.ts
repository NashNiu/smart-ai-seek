import { tools } from "@/utils";
import ReconnectingWebSocket from "reconnecting-websocket";
import { createContext, useState } from "react";
import { currentChat } from "@/store/chat";
import { App } from "antd";
import { consts } from "@/utils";
const useSocket = () => {
  const { message: messageApi } = App.useApp();
  const { setAnswerStatus, addItem, addLastContent, setNeedScroll } =
    currentChat();
  const [socket, setSocket] = useState<ReconnectingWebSocket | null>(null);
  // Initialize socket
  const initSocket = () => {
    const url = `${location.protocol === "https:" ? "wss" : "ws"}://${
      location.host
    }/apis/magic-ws`;
    // const url = "ws://192.168.0.44:9998/magic-ws";
    const rws = new ReconnectingWebSocket(url, [], {
      // connectionTimeout: 1000,
      maxRetries: 10,
      // maxReconnectionDelay: 4000,
      // minReconnectionDelay: 10,
    });
    rws.onopen = () => {
      setSocket(rws);
    };
    rws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "control") {
        if (data.text === "conversation-chain-start") {
          setAnswerStatus(consts.AnswerStatus.StartAnswer);
          window.currentAnswerType = "thinking";
          addItem({
            id: tools.generateRandomString(),
            thinkingPart: "",
            answerPart: "",
            role: "assistant",
            content: "",
          });
          // Answer started
        } else if (data.text === "conversation-chain-end") {
          // Answer ended
          setAnswerStatus(consts.AnswerStatus.Ended);
          window.currentAnswerType = "ended";
        }
      } else if (data.type === "llm-text" || data.type === "llm-audio") {
        const str = data.text;
        let thinkingPart = "";
        let answerPart = "";
        const thinkingStart = "<blockquote>";
        const thinkEnd = "</blockquote>";

        // If content contains <think>, start thinking
        if (str.includes("<think>")) {
          setAnswerStatus(consts.AnswerStatus.Thinking);
          window.currentAnswerType = "thinking";
          if (str.includes("</think>")) {
            setAnswerStatus(consts.AnswerStatus.ThinkingEnded);
            window.currentAnswerType = "answer";
            thinkingPart =
              thinkingStart +
              str.split("<think>")[1].split("</think>")[0] +
              thinkEnd;
            answerPart = str.split("</think>")[1];
          } else {
            thinkingPart = thinkingStart + str.split("<think>")[1];
            answerPart = "";
          }
        } else if (str.includes("</think>")) {
          setAnswerStatus(consts.AnswerStatus.ThinkingEnded);
          window.currentAnswerType = "answer";
          thinkingPart = str.split("</think>")[0] + thinkEnd;
          answerPart = str.split("</think>")[1];
        } else {
          if (window.currentAnswerType === "thinking") {
            thinkingPart = str;
            answerPart = "";
          } else {
            setAnswerStatus(consts.AnswerStatus.StartAnswer);
            thinkingPart = "";
            answerPart = str;
          }
        }
        addLastContent({ thinkingPart, answerPart });
        setNeedScroll(true);
      }
    };
    rws.onclose = () => {
      //   clearInterval(timer);
      setSocket(null);
    };
    setSocket(rws);
  };
  // Send message
  const sendMessage = (message: any) => {
    if (socket) {
      socket.send(JSON.stringify(message));
    } else {
      messageApi.error("Connection error, please try again later");
    }
  };
  return {
    initSocket,
    socket,
    sendMessage,
  };
};

export default useSocket;

export const SocketContext = createContext<{
  socket: ReconnectingWebSocket | null;
  sendMessage: (message: any) => void;
}>({
  socket: null,
  sendMessage: () => {},
});
