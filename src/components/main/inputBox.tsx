import { ArrowUpOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { useEffect, useRef, useState, useContext } from "react";
import { useMedia } from "react-use";
import styled, { css } from "styled-components";
import { useChatStore } from "@/store";
import { tools } from "@/utils";
import { SocketContext } from "@/hooks";

interface InputAreaProps {
  footerResize?: () => void;
}
const InputArea = ({ footerResize }: InputAreaProps) => {
  const { sendMessage } = useContext(SocketContext);
  const {
    addItem,
    answerStatus,
    setNeedScroll,
    finishAsk,
    id: currentChatId,
    setCurrentChatId,
    items: currentChatItems,
  } = useChatStore.currentChat();
  const { addChat } = useChatStore.chatList();
  const { isSearch, toggleSearch } = useChatStore.askState();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // 是否深度思考
  // const [isDeep, setIsDeep] = useState(false);
  // 输入内容
  const [inputValue, setInputValue] = useState("");
  // 是否可以发送
  const [canSend, setCanSend] = useState(false);
  const isPC = useMedia("(min-width: 768px)");
  const handleTextInput = () => {
    textAreaRef.current!.style.height = "auto";
    textAreaRef.current!.style.height =
      Math.min(textAreaRef.current!.scrollHeight, 300) + "px";
    footerResize?.();
  };
  const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      if (canSend) {
        onSend();
      }
    }
  };
  const onSend = () => {
    if (!inputValue) return;
    if (answerStatus !== 2) {
      return;
    }
    finishAsk();
    setInputValue("");
    sendMessage({
      text: inputValue,
      type: isSearch ? "duckgo-input" : "text-input",
    });
    const askItem: Chat.MsgItem = {
      id: tools.generateRandomString(12),
      content: inputValue,
      role: "user",
    };
    addItem(askItem);
    // 是否是新的聊天
    if (currentChatId) {
      // 当前已有聊天
      localStorage.setItem(
        currentChatId,
        JSON.stringify([...currentChatItems, askItem])
      );
    } else {
      // 新创建的聊天
      const randomId = tools.generateRandomString(15);
      setCurrentChatId(randomId);
      addChat({ id: randomId, title: inputValue });
    }
    setNeedScroll(true);
  };
  useEffect(() => {
    if (inputValue) {
      setCanSend(true);
    } else {
      setCanSend(false);
    }
  }, [inputValue]);

  return (
    <Container>
      <InputBox $isPC={isPC}>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          ref={textAreaRef}
          className="textarea"
          placeholder="请输入内容"
          onInput={handleTextInput}
          onKeyDown={handleKeydown}
        />
      </InputBox>
      <div className="actionBox">
        <Space>
          {/* <Button
            color={isDeep ? "primary" : "default"}
            variant="outlined"
            onClick={() => setIsDeep((isDeep) => !isDeep)}
          >
            深度思考
          </Button> */}
          <Button
            color={isSearch ? "primary" : "default"}
            variant="outlined"
            onClick={toggleSearch}
          >
            联网搜索
          </Button>
        </Space>
        <Space>
          {/* <PaperClipOutlined className="rotate-135 text-lg cursor-pointer" /> */}
          {answerStatus < 2 ? (
            <Button type="primary" loading></Button>
          ) : (
            <Button
              icon={<ArrowUpOutlined />}
              type="primary"
              shape="circle"
              disabled={!canSend}
              onClick={onSend}
            ></Button>
          )}
        </Space>
      </div>
    </Container>
  );
};

export default InputArea;
const Container = styled.div`
  background-color: rgba(243, 244, 246, 1);
  box-shadow: 0px 0px 0px 0.5px #dce0e9;
  border-radius: 24px;
  padding: 10px;
  .actionBox {
    padding: 0 10px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const InputBox = styled.div<{ $isPC?: boolean }>`
  ${({ $isPC }) =>
    $isPC
      ? css`
          /* min-height: 110px; */
          max-height: 500px;
        `
      : css`
          /* height: 126px; */
        `}
  .textarea {
    resize: none;
    width: 100%;
    border: none;
    background-color: transparent;
    outline: none;
    padding: 10px;
    max-height: 300px;
    min-height: 60px;
  }
`;

