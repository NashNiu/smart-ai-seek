import logoImg from "@/assets/imgs/logo.png";
import TypewriterMarkdown from "@/components/other/TypewriterMarkdown";
import { useChatStore, useUiStore } from "@/store";
import { tools } from "@/utils";
import { Bubble } from "@ant-design/x";
import { Spin } from "antd";
import markdownit from "markdown-it";
import { useEffect, useRef } from "react";
import styled from "styled-components";
const MsgBox = () => {
  const {
    id: currentChatId,
    items,
    needScroll,
    setNeedScroll,
    answerStatus,
  } = useChatStore.currentChat();
  const { height: footerHeight } = useUiStore.useFooterHeight();
  const md = markdownit({ html: true });
  const containerRef = useRef<HTMLDivElement>(null);
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
                classNames={{ content: "!rounded-full !bg-[#eff6ff]" }}
                content={item.content}
              />
            </div>
          ) : (
            <div className="flex justify-start items-start gap-4">
              <img src={logoImg} alt="avatar" />
              {answerStatus !== 0 || index !== items.length - 1 ? (
                <div className="prose">
                  {/* 回答中 */}
                  {answerStatus === 1 && index === items.length - 1 ? (
                    <>
                      <Spin />
                      <TypewriterMarkdown content={item.content} delay={50} />
                    </>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: md.render(
                          tools.convertThinkTagToBlockquote(item.content)
                        ),
                      }}
                    ></div>
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
