import { useChatStore } from "@/store";
import markdownit from "markdown-it";
import { useEffect, useRef, useState } from "react";

const md = markdownit({ html: true });

interface TypewriterMarkdownProps {
  content: string;
  delay?: number;
  onFinish?: (state: boolean) => void;
}
const TypewriterMarkdown = ({
  content,
  delay = 30,
  onFinish,
}: TypewriterMarkdownProps) => {
  const { setNeedScroll } = useChatStore.currentChat();
  const [fullContent, setFullContent] = useState(""); // 完整内容
  const [displayedContent, setDisplayedContent] = useState(""); // 当前显示内容
  const currentIndexRef = useRef(0); // 当前显示位置
  const timeoutRef = useRef<number | null>(null); // 定时器

  // 当 content 更新时，追加到完整内容中
  useEffect(() => {
    // prev
    setFullContent(content);
  }, [content]);

  // 逐字显示逻辑
  useEffect(() => {
    const processNextChar = () => {
      if (currentIndexRef.current < fullContent.length) {
        setDisplayedContent((prev) => {
          // 每次拼接3个字符
          const nextChars = fullContent.slice(
            currentIndexRef.current,
            currentIndexRef.current + 1
          );
          currentIndexRef.current += 1;
          return prev + nextChars;
        });
        setNeedScroll(true);
        // 递归调用，设置下一次触发
        timeoutRef.current = setTimeout(processNextChar, delay);
        onFinish?.(false);
      } else {
        // 通知外部显示完成
        onFinish?.(true);
      }
    };

    // 如果当前显示位置落后于完整内容长度，启动逐字显示
    if (currentIndexRef.current < fullContent.length) {
      timeoutRef.current = setTimeout(processNextChar, delay);
    }

    // 清理函数：清除定时器
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fullContent, delay]);

  // 将拼接后的 Markdown 转换为 HTML
  const html = md.render(displayedContent);
  // 渲染结果
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default TypewriterMarkdown;

