import copyImg from "@/assets/imgs/copy.png";
import logoImg from "@/assets/imgs/logo.png";
import reloadImg from "@/assets/imgs/reload.png";
import TypewriterMarkdown from "@/components/other/TypewriterMarkdown";
import { useChatStore, useUiStore } from "@/store";
import { tools } from "@/utils";
import { Bubble } from "@ant-design/x";
import { Spin, Tooltip } from "antd";
import markdownit from "markdown-it";
import { useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components";
import { useCopyToClipboard } from "react-use";
import { CheckOutlined } from "@ant-design/icons";
import { SocketContext } from "@/hooks";

const MsgBox = () => {
  const {
    id: currentChatId,
    items,
    needScroll,
    setNeedScroll,
    answerStatus,
    updateItem,
    clearAfter,
    finishAsk,
  } = useChatStore.currentChat();
  const { isSearch } = useChatStore.askState();
  const { height: footerHeight } = useUiStore.useFooterHeight();
  const { sendMessage } = useContext(SocketContext);
  const md = markdownit({ html: true });
  const containerRef = useRef<HTMLDivElement>(null);
  // 正在输出答案
  const [isTyping, setIsTyping] = useState(false);
  // 复制
  const [, copyToClipboard] = useCopyToClipboard();

  // 滚动到最底部
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
      setNeedScroll(false);
    }
  };
  // 重新生成
  const regenerate = (id: string, index: number) => {
    clearAfter(id);
    const content = items[index - 1].content;
    finishAsk();
    sendMessage({
      text: content,
      type: isSearch ? "duckgo-input" : "text-input",
    });
  };
  useEffect(() => {
    if (needScroll) {
      scrollToBottom();
    }
  }, [needScroll]);
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(currentChatId, JSON.stringify(items));
    }
  }, [items]);
  return (
    <Container style={{ paddingBottom: footerHeight }} ref={containerRef}>
      {items.map((item, index) => (
        <div key={item.id} className="mt-1">
          {item.role === "user" ? (
            <div className="flex justify-end">
              <Bubble
                className="bg-transparent"
                classNames={{ content: "!rounded-2xl !bg-[#eff6ff]" }}
                content={item.content}
              />
            </div>
          ) : (
            <div className="flex justify-start items-start gap-4">
              <img src={logoImg} alt="avatar" />
              {answerStatus !== 0 || index !== items.length - 1 ? (
                <div className="prose">
                  {/* 回答中, 最后一个，正在输出 */}
                  {(answerStatus === 1 || isTyping) &&
                  index === items.length - 1 ? (
                    <>
                      <Spin />
                      <TypewriterMarkdown
                        onTypeStateChange={setIsTyping}
                        content={item.content}
                        delay={10}
                      />
                    </>
                  ) : (
                    <>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: md.render(
                            tools.convertThinkTagToBlockquote(item.content)
                          ),
                        }}
                      ></div>
                      <div className="flex gap-2 h-6">
                        <Tooltip title="复制">
                          {item.copied ? (
                            <CheckOutlined className="cursor-pointer w-5 h-5 mt-0 mb-0" />
                          ) : (
                            <img
                              onClick={() => {
                                copyToClipboard(item.content);
                                updateItem({ id: item.id, copied: true });
                                setTimeout(() => {
                                  updateItem({ id: item.id, copied: false });
                                }, 2000);
                              }}
                              className="cursor-pointer w-5 h-5 mt-0 mb-0"
                              src={copyImg}
                              alt=""
                            />
                          )}
                        </Tooltip>
                        <Tooltip title="重新生成">
                          <img
                            onClick={() => {
                              regenerate(item.id, index);
                            }}
                            className="cursor-pointer w-5 h-5 mt-0 mb-0"
                            src={reloadImg}
                            alt=""
                          />
                        </Tooltip>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="mt-2">
                  <Spin />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </Container>
  );
};
export default MsgBox;
const Container = styled.div`
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 10px;
  // 去掉滚动条
  &::-webkit-scrollbar {
    display: none;
  }
  .bottomLine {
    width: 100%;
    height: 1px;
  }
`;
