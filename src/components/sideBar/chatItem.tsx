import { useChatStore } from "@/store";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Input, App } from "antd";
import styled from "styled-components";
import { useState } from "react";

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
      label: "重命名",
      key: "1",
      icon: <EditOutlined />,
    },
    {
      label: "删除",
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
      // 删除
      modal.confirm({
        title: "确认删除",
        content: "确定要删除这个对话吗？",
        okText: "确定",
        cancelText: "取消",
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
    // 正在回答
    if (answerStatus !== 2) return;
    setCurrentChatId(item.id);
    const currentChat = localStorage.getItem(item.id);
    if (currentChat) {
      setItems(JSON.parse(currentChat));
    }
  };
  return (
    <ChatItemWrapper
      onClick={onItemClick}
      className={`${isActive ? "active" : ""} ${
        answerStatus !== 2 ? "cursor-not-allowed" : "group cursor-pointer"
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

