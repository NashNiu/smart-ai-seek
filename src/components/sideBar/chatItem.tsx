import { useChatStore } from "@/store";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Input, App } from "antd";
import styled from "styled-components";
import { useState } from "react";
import { consts } from "@/utils";

const ChatItem = ({ item }: { item: Chat.HistoryListItem }) => {
  const { modal } = App.useApp();
  const {
    id: currentChatId,
    setCurrentChatId,
    setItems,
    createNewChat,
    answerStatus,
  } = useChatStore.currentChat();
  const { updateChat, removeChat } = useChatStore.chatList();
  const isActive = currentChatId === item.id;
  const menuConfig: MenuProps["items"] = [
    {
      label: "Rename",
      key: "1",
      icon: <EditOutlined />,
    },
    {
      label: "Delete",
      key: "2",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];
  const dropdownClick = (
    key: string,
    id: string,
    domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    domEvent.stopPropagation();
    if (key === "1") {
      updateChat({
        id,
        editable: true,
      });
    }
    if (key === "2") {
      // Delete
      modal.confirm({
        title: "Confirm Delete",
        content: "Are you sure you want to delete this conversation?",
        okText: "Confirm",
        cancelText: "Cancel",
        onOk: () => {
          removeChat(id);
          if (currentChatId === id) {
            createNewChat();
          }
          localStorage.removeItem(id);
        },
      });
    }
  };
  const [value, setValue] = useState(item.title);
  const onBlur = () => {
    updateChat({
      id: item.id,
      editable: false,
      title: value,
    });
  };
  const onItemClick = () => {
    // Answering in progress
    if (answerStatus !== consts.AnswerStatus.Ended) return;
    setCurrentChatId(item.id);
    const currentChat = localStorage.getItem(item.id);
    if (currentChat) {
      const currentChatList = JSON.parse(currentChat);
      setItems(
        currentChatList.map((item: Chat.MsgItem) => {
          if (item.role === "user") {
            return item;
          } else {
            if (item.thinkingPart && item.answerPart) {
              return item;
            }
            return {
              ...item,
              thinkingPart:
                "<blockquote>" +
                item.content?.split("</think>")[0]?.replace("<think>", "") +
                "</blockquote>",
              answerPart: item.content?.split("</think>")[1],
            };
          }
        })
      );
    }
  };
  return (
    <ChatItemWrapper
      onClick={onItemClick}
      className={`${isActive ? "active" : ""} ${
        answerStatus !== consts.AnswerStatus.Ended
          ? "cursor-not-allowed"
          : "group cursor-pointer"
      } `}
    >
      {item.editable ? (
        <Input
          onClick={(e) => e.stopPropagation()}
          value={value}
          onBlur={onBlur}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <span className="text-ellipsis whitespace-nowrap overflow-hidden">
          {item.title}
        </span>
      )}
      <div className="group-hover:block hidden">
        <Dropdown
          menu={{
            items: menuConfig,
            onClick: ({ key, domEvent }) =>
              dropdownClick(key, item.id, domEvent),
          }}
        >
          <a onClick={(e) => e.stopPropagation()}>
            <MoreOutlined />
          </a>
        </Dropdown>
      </div>
    </ChatItemWrapper>
  );
};

export default ChatItem;

const ChatItemWrapper = styled.div`
  padding: 10px 15px;
  border-radius: 12px;
  font-size: 16px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow-x: hidden;
  gap: 10px;
  &:hover {
    background-color: #eff6ff;
  }
  &.active {
    background-color: #dbeafe;
  }
`;
