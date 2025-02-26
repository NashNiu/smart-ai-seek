import { useState, useContext } from "react";
import { Collapse, Tooltip } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useChatStore } from "@/store";
import { consts } from "@/utils";
import copyImg from "@/assets/imgs/copy.png";
import reloadImg from "@/assets/imgs/reload.png";
import { SocketContext } from "@/hooks";
import { useCopyToClipboard } from "react-use";
import markdownit from "markdown-it";

interface AnswerDisplayProps {
  msg: Chat.MsgItem;
  index: number;
}

// 回答完之后的答案显示
const AnswerDisplay = ({ msg, index }: AnswerDisplayProps) => {
  const {
    items,
    updateItem,
    clearAfter,
    setAnswerStatus,
    setOutputStatus,
    setThinkingDefaultActiveKey,
    thinkingDefaultActiveKey,
  } = useChatStore.currentChat();
  const [activeKey, setActiveKey] = useState(thinkingDefaultActiveKey);
  const { sendMessage } = useContext(SocketContext);
  const md = markdownit({ html: true });
  const [, copyToClipboard] = useCopyToClipboard();
  // 重新生成
  const regenerate = (id: string, index: number) => {
    const item = items[index - 1];
    const params: any = {
      text: item.content,
      type: item.type,
    };
    if (item.type === "pdf-input") {
      params.pdf = item.filePath;
    }
    if (item.type === "img-sys-input") {
      params.image = item.filePath;
    }
    clearAfter(id);
    setAnswerStatus(consts.AnswerStatus.Asked);
    setOutputStatus("thinking");
    sendMessage(params);
  };
  return (
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
            label: <div className="text-gray-600 text-sm">已深度思考</div>,
            children: (
              <div
                dangerouslySetInnerHTML={{
                  __html: md.render(msg?.thinkingPart ?? ""),
                }}
              ></div>
            ),
            forceRender: true,
            classNames: {
              header: "!inline-flex",
            },
          },
        ]}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: md.render(msg?.answerPart ?? ""),
        }}
      ></div>
      <div className="flex gap-2 h-6">
        <Tooltip title="复制">
          {msg.copied ? (
            <CheckOutlined className="cursor-pointer w-5 h-5 mt-0 mb-0" />
          ) : (
            <img
              onClick={() => {
                copyToClipboard(
                  (msg?.thinkingPart ?? "") + (msg?.answerPart ?? "")
                );
                updateItem({ id: msg.id, copied: true });
                setTimeout(() => {
                  updateItem({ id: msg.id, copied: false });
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
              regenerate(msg.id, index);
            }}
            className="cursor-pointer w-5 h-5 mt-0 mb-0"
            src={reloadImg}
            alt=""
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default AnswerDisplay;

