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
  // 初始化socket
  const initSocket = () => {
    const url = `${location.protocol === "https:" ? "wss" : "ws"}://${
      location.host
    }/apis/magic-ws`;
    // const url = "ws://192.168.0.44:9998/magic-ws";
    const rws = new ReconnectingWebSocket(url, [], {
      // connectionTimeout: 1000,
      // maxRetries: 4,
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
          // 回答开始
        } else if (data.text === "conversation-chain-end") {
          // 回答结束
          setAnswerStatus(consts.AnswerStatus.Ended);
          window.currentAnswerType = "ended";
        }
      } else if (data.type === "llm-text" || data.type === "llm-audio") {
        const str = data.text;
        let thinkingPart = "";
        let answerPart = "";
        const thinkingStart = "<blockquote>";
        const thinkEnd = "</blockquote>";

        // 如果内容包含 <think> 则开始思考
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
  // 发送消息
  const sendMessage = (message: any) => {
    if (socket) {
      socket.send(JSON.stringify(message));
    } else {
      messageApi.error("连接出错，请稍后再试");
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
