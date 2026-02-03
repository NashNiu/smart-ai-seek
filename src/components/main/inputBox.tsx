import {
  ArrowUpOutlined,
  PaperClipOutlined,
  CloseOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Space, Tooltip, Upload, App } from "antd";
import { useEffect, useRef, useState, useContext } from "react";
import { useMedia } from "react-use";
import styled, { css } from "styled-components";
import { useChatStore } from "@/store";
import { tools, consts } from "@/utils";
import { SocketContext } from "@/hooks";
import { UploadFile } from "antd";
import pdfImg from "@/assets/imgs/pdf.png";
import picImg from "@/assets/imgs/pic.png";

interface InputAreaProps {
  footerResize?: () => void;
}
interface UploadResponse {
  url: string;
  message: string;
  status: number;
}
const InputArea = ({ footerResize }: InputAreaProps) => {
  const { message } = App.useApp();
  const { sendMessage } = useContext(SocketContext);
  const {
    addItem,
    answerStatus,
    setNeedScroll,
    id: currentChatId,
    setCurrentChatId,
    items: currentChatItems,
    setAnswerStatus,
    setOutputStatus,
  } = useChatStore.currentChat();
  const [fileList, setFileList] = useState<UploadFile<UploadResponse>[]>([]);
  const { addChat } = useChatStore.chatList();
  const { isSearch, toggleSearch } = useChatStore.askState();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // 输入内容
  const [inputValue, setInputValue] = useState("");
  // 是否可以发送
  const [canSend, setCanSend] = useState(false);
  const isPC = useMedia("(min-width: 768px)");
  const uploadTip = isSearch ? (
    "File upload is not supported in web search mode"
  ) : (
    <div>
      <div>Upload attachment (text only)</div>
      <div className="text-[12px] text-gray-300">
        Max 1 file, 1MB max, supports images and PDF
      </div>
    </div>
  );
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
  const beforeUpload = (file: File) => {
    if (file.size > 1024 * 1024) {
      message.error("File size cannot exceed 1MB");
      return Upload.LIST_IGNORE;
    }
    return true;
  };
  const uploadChange = ({ fileList }: any) => {
    setFileList(fileList);
    // setFileList(newFileList);
  };
  const onSend = () => {
    if (answerStatus !== consts.AnswerStatus.Ended) {
      return;
    }
    setAnswerStatus(consts.AnswerStatus.Asked);
    setOutputStatus("thinking");
    const params: any = {
      text: inputValue,
    };
    const msgItem: Chat.MsgItem = {
      id: tools.generateRandomString(12),
      content: inputValue,
      role: "user",
    };
    if (isSearch) {
      params.type = "duckgo-input";
      msgItem.type = "duckgo-input";
    } else {
      if (fileList.length && fileList[0].status === "done") {
        if (fileList[0].type === "application/pdf") {
          params.type = "pdf-input";
          params.pdf = fileList[0].response?.url;
          msgItem.type = "pdf-input";
          msgItem.fileName = fileList[0].name;
          msgItem.filePath = fileList[0].response?.url;
          msgItem.size = tools.formatFileSize(fileList[0].size || 0);
        } else {
          // 本地
          params.type = "img-sys-input";
          // 网络
          // params.type = "img-net-input";
          params.image = fileList[0].response?.url;
          // params.image =
          //   "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png";
          msgItem.type = "img-sys-input";
          msgItem.fileName = fileList[0].name;
          msgItem.filePath = fileList[0].response?.url;
          msgItem.size = tools.formatFileSize(fileList[0].size || 0);
        }
      } else {
        params.type = "text-input";
        msgItem.type = "text-input";
      }
    }
    sendMessage(params);
    setInputValue("");
    setFileList([]);
    addItem(msgItem);
    textAreaRef.current!.style.height = "auto";
    footerResize?.();
    // 是否是新的聊天
    if (currentChatId) {
      // 当前已有聊天
      localStorage.setItem(
        currentChatId,
        JSON.stringify([...currentChatItems, msgItem])
      );
    } else {
      // 新创建的聊天
      const randomId = tools.generateRandomString(15);
      setCurrentChatId(randomId);
      addChat({ id: randomId, title: inputValue || msgItem.fileName  });
    }
    setNeedScroll(true);
  };
  // Stop generation
  const stopGenerate = () => {
    setAnswerStatus(consts.AnswerStatus.Ended);
    setOutputStatus("answerEnded");
    sendMessage({
      type: "interrupt-signal",
    });
  };
  useEffect(() => {
    const imageUrl = fileList[0]?.response?.url;
    if (inputValue || imageUrl) {
      setCanSend(true);
    } else {
      setCanSend(false);
    }
  }, [inputValue, fileList]);
  return (
    <Container>
      {fileList.length > 0 && (
        <AttachContainer>
          {fileList[0]?.type === "application/pdf" && (
            <div className="text-[12px] text-gray-600 pl-2 pb-1">
              Text only from attachment
            </div>
          )}
          <div className="flex flex-wrap">
            {fileList.map((item) => (
              <div key={item.uid} className="itemBox">
                <div className="w-10 flex justify-center items-center">
                  {item.status === "error" && (
                    <ExclamationCircleOutlined
                      style={{ fontSize: "25px", color: "#e42020" }}
                    />
                  )}
                  {item.status === "uploading" && (
                    <LoadingOutlined
                      style={{ fontSize: "25px", color: "#adadad" }}
                    />
                  )}
                  {item.status === "done" && (
                    <img
                      className="w-[40px]"
                      src={item.name.endsWith(".pdf") ? pdfImg : picImg}
                      alt=""
                    />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.name}
                  </div>
                  <div className="text-[12px] text-gray-500">
                    {item.status === "error" ? (
                      <span className="text-red-500">Parse failed</span>
                    ) : (
                      <span>{tools.formatFileSize(item.size || 0)} </span>
                    )}
                  </div>
                </div>
                <div className="closeIcon">
                  <CloseOutlined
                    style={{ color: "#fff" }}
                    className="text-[12px] "
                    onClick={() =>
                      setFileList(fileList.filter((i) => i.uid !== item.uid))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </AttachContainer>
      )}
      <InputContainer>
        <InputBox $isPC={isPC}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            ref={textAreaRef}
            className="textarea"
            placeholder="Please enter content"
            onInput={handleTextInput}
            onKeyDown={handleKeydown}
          />
        </InputBox>
        <div className="actionBox">
          <Space>
            <Tooltip
              title={
                fileList.length ? "Please delete the file first to enable web search" : "Search web as needed"
              }
            >
              <Button
                color={isSearch ? "primary" : "default"}
                variant={isSearch ? "outlined" : "filled"}
                onClick={toggleSearch}
                disabled={fileList.length > 0}
              >
                Web Search
              </Button>
            </Tooltip>
          </Space>
          <Space>
            <Tooltip title={uploadTip}>
              <Upload
                action={(file) =>
                  file.type === "application/pdf"
                    ? "/apis/upload-pdf"
                    : "/apis/upload-img"
                }
                multiple={false}
                maxCount={1}
                fileList={fileList}
                name="file"
                accept="image/*,.pdf"
                beforeUpload={beforeUpload}
                showUploadList={false}
                onChange={uploadChange}
              >
                <Button type="text" shape="circle" disabled={isSearch}>
                  <PaperClipOutlined className="rotate-135 text-xl cursor-pointer" />
                </Button>
              </Upload>
            </Tooltip>
            {answerStatus < consts.AnswerStatus.Ended ? (
              <Tooltip title="Stop generating">
                <div
                  className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={stopGenerate}
                >
                  <div className="w-3 h-3 bg-white"></div>
                </div>
              </Tooltip>
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
      </InputContainer>
    </Container>
  );
};

export default InputArea;
const Container = styled.div`
  border-radius: 24px;
  border: 1px solid #dce0e9;
`;
const AttachContainer = styled.div`
  padding: 10px;
  .itemBox {
    /* margin: 10px 0 10px 10px; */
    padding: 5px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #ebebeb;
    border-radius: 10px;
    position: relative;
    width: 200px;
    height: 60px;
    /* overflow: hidden; */
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      box-shadow: 0px 0px 0px 0.5px #dce0e9;
      .closeIcon {
        display: flex;
      }
    }
    .closeIcon {
      position: absolute;
      right: -7px;
      top: -5px;
      background-color: #696969;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      padding: 4px;
      justify-content: center;
      align-items: center;
      /* display: flex; */
      display: none;
    }
  }
`;
const InputContainer = styled.div`
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
