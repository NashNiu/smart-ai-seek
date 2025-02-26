import logoImg from "@/assets/imgs/logo.png";
import pdfImg from "@/assets/imgs/pdf.png";
import picImg from "@/assets/imgs/pic.png";
import AnswerDisplay from "@/components/other/AnswerDisplay";
import TypewriterMarkdown from "@/components/other/TypewriterMarkdown";
import { useChatStore, useUiStore } from "@/store";
import { consts } from "@/utils";
import { LoadingOutlined } from "@ant-design/icons";
import { Bubble } from "@ant-design/x";
import { Collapse, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const MsgBox = () => {
  const {
    id: currentChatId,
    items,
    needScroll,
    setNeedScroll,
    answerStatus,
    outputStatus,
    setOutputStatus,
    thinkingDefaultActiveKey,
    setThinkingDefaultActiveKey,
  } = useChatStore.currentChat();
  const { height: footerHeight } = useUiStore.useFooterHeight();
  const { setFileInfo } = useUiStore.useRightSidebar();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<string[]>(
    thinkingDefaultActiveKey
  );
  const [typeFinished, setTypeFinished] = useState(false);
  const { openRightSidebar } = useUiStore.useRightSidebar();
  const [userScrolling, setUserScrolling] = useState(false);

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
    if (typeFinished && answerStatus === consts.AnswerStatus.Ended) {
      setOutputStatus("answerEnded");
    }
  }, [typeFinished, answerStatus]);

  // 处理图片点击
  const handleImageClick = (item: Chat.MsgItem) => {
    console.log(item);
    if (item.filePath) {
      openRightSidebar();
      setFileInfo({ name: item.fileName ?? "", url: item.filePath ?? "" });
    }
  };
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        // 向上滚动
        setUserScrolling(true);
        setNeedScroll(false);
      }
    };

    container.addEventListener("wheel", handleWheel);
    return () => container.removeEventListener("wheel", handleWheel);
  }, [setNeedScroll]);

  useEffect(() => {
    if (needScroll && !userScrolling) {
      scrollToBottom();
    }
  }, [needScroll, userScrolling]);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(currentChatId, JSON.stringify(items));
    }
  }, [items]);
  useEffect(() => {
    if (items.length > 0) {
      setUserScrolling(false);
    }
  }, [items.length]);

  return (
    <Container style={{ paddingBottom: footerHeight }} ref={containerRef}>
      {items.map((item, index) => (
        <div key={item.id} className="mt-1">
          {item.role === "user" ? (
            <div>
              {item.type === "img-sys-input" && (
                <div className="flex justify-end mb-2">
                  <div
                    onClick={() => handleImageClick(item)}
                    className="flex items-center bg-gray-100 rounded-2xl px-4 py-2 gap-2 cursor-pointer hover:shadow-md transition-all duration-300"
                  >
                    <img src={picImg} className="w-6" alt="" />
                    <div className="flex flex-col space-between">
                      <span className="max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.fileName}
                      </span>
                      <span className="text-gray-500 text-[12px]">
                        {item.size}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {item.type === "pdf-input" && (
                <div className="flex justify-end mb-2">
                  <div className="flex items-center bg-gray-100 rounded-2xl px-4 py-2 gap-2">
                    <img src={pdfImg} className="w-6" alt="" />
                    <div className="flex flex-col space-between">
                      <span className="max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.fileName}
                      </span>
                      <span className="text-gray-500 text-[12px]">
                        {item.size}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {item.content && (
                <div className="flex justify-end">
                  <Bubble
                    className="bg-transparent"
                    classNames={{ content: "!rounded-2xl !bg-[#eff6ff]" }}
                    content={item.content}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-start items-start gap-4">
              <img src={logoImg} alt="avatar" />

              {/* 最后一条 */}
              {index === items.length - 1 && (
                <>
                  {answerStatus === consts.AnswerStatus.Ended &&
                  outputStatus === "answerEnded" ? (
                    <AnswerDisplay index={index} msg={item} />
                  ) : (
                    <div className="prose">
                      <Collapse
                        bordered={false}
                        expandIconPosition="end"
                        accordion
                        activeKey={activeKey}
                        onChange={(key) => {
                          setActiveKey(key);
                          setThinkingDefaultActiveKey(key);
                        }}
                        items={[
                          {
                            key: "1",
                            label: (
                              <div className="text-gray-600 text-sm">
                                {answerStatus === consts.AnswerStatus.Asked ? (
                                  <Spin indicator={<LoadingOutlined spin />} />
                                ) : (
                                  <span>
                                    {outputStatus === "thinking"
                                      ? "思考中..."
                                      : "已深度思考"}
                                  </span>
                                )}
                              </div>
                            ),
                            children: (
                              <TypewriterMarkdown
                                onFinish={(finished) => {
                                  if (finished) {
                                    if (
                                      window.currentAnswerType !== "thinking"
                                    ) {
                                      setOutputStatus("answering");
                                    } else {
                                      setOutputStatus("thinking");
                                    }
                                  } else {
                                    setOutputStatus("thinking");
                                  }
                                }}
                                content={item?.thinkingPart ?? ""}
                                delay={30}
                              />
                            ),
                            classNames: {
                              header: "!inline-flex",
                            },
                            forceRender: true,
                          },
                        ]}
                      />
                      {outputStatus === "answering" &&
                        [
                          consts.AnswerStatus.ThinkingEnded,
                          consts.AnswerStatus.StartAnswer,
                          consts.AnswerStatus.Ended,
                        ].includes(answerStatus) && (
                          <TypewriterMarkdown
                            onFinish={(finished) => {
                              if (finished) {
                                setTypeFinished(true);
                                if (window.currentAnswerType === "ended") {
                                  setOutputStatus("answerEnded");
                                } else {
                                  setOutputStatus("answering");
                                }
                              } else {
                                setOutputStatus("answering");
                              }
                            }}
                            content={item?.answerPart ?? ""}
                            delay={30}
                          />
                        )}
                      {(outputStatus === "thinking" ||
                        outputStatus === "answering") && (
                        <div
                          className="mb-2"
                          onClick={() => {
                            console.log(outputStatus);
                          }}
                        >
                          <Spin indicator={<LoadingOutlined spin />} />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
              {/* 不是最后一条 */}
              {index !== items.length - 1 && (
                <AnswerDisplay index={index} msg={item} />
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
