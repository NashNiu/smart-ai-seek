import { tools } from "@/utils";
import ReconnectingWebSocket from "reconnecting-websocket";
import { createContext, useState } from "react";
import { currentChat } from "@/store/chat";
const useSocket = () => {
  const { startAnswer, endAnswer, addItem, addLastContent, setNeedScroll } =
    currentChat();
  const [socket, setSocket] = useState<ReconnectingWebSocket | null>(null);
  // 初始化socket
  const initSocket = () => {
    const url = `${location.protocol === "https:" ? "wss" : "ws"}://${
      location.host
    }/`;
    // const url = `/`;
    const rws = new ReconnectingWebSocket(url, [], {
      // connectionTimeout: 1000,
      maxRetries: 4,
      // maxReconnectionDelay: 4000,
      // minReconnectionDelay: 10,
    });
    rws.onopen = () => {
      console.log("WebSocket opened");
    };
    rws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "control") {
        if (data.text === "conversation-chain-start") {
          startAnswer();
          addItem({
            id: tools.generateRandomString(),
            content: "",
            role: "assistant",
          });
          // 回答开始
        } else if (data.text === "conversation-chain-end") {
          // 回答结束
          endAnswer();
        }
      } else if (data.type === "llm-text" || data.type === "llm-audio") {
        addLastContent(data.text);
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

