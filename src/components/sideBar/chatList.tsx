import { useChatStore } from "@/store";
import { useEffect } from "react";
import styled from "styled-components";
import ChatItem from "./chatItem";
const ChatList = () => {
  const { initChatList, list } = useChatStore.chatList();

  useEffect(() => {
    initChatList();
  }, []);
  useEffect(() => {
    localStorage.setItem("chatList", JSON.stringify(list));
  }, [list]);
  return (
    <ChatListContainer>
      <div>
        {list.map((item) => (
          <ChatItem item={item} key={item.id} />
        ))}
      </div>
    </ChatListContainer>
  );
};

export default ChatList;

const ChatListContainer = styled.div`
  margin-top: 20px;
  padding: 0 10px;
`;

