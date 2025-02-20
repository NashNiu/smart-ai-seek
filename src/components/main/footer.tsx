import { useMedia } from "react-use";
import styled from "styled-components";
import InputBox from "./inputBox";
import { useRef } from "react";
import { useUiStore } from "@/store";
const Footer = () => {
  const isPC = useMedia("(min-width: 768px)");
  const footerRef = useRef<HTMLDivElement>(null);
  const { setHeight } = useUiStore.useFooterHeight();
  // 获取footer高度
  const getFooterHeight = () => {
    const footerHeight = footerRef.current?.clientHeight;
    if (footerHeight) {
      setHeight(Math.max(footerHeight, 180));
    }
  }
  return (
    <Container $isPC={isPC} ref={footerRef}>
      <div className="inputContainer">
        <InputBox footerResize={getFooterHeight} />
      </div>
      <div className="tips">内容由AI生成，请仔细甄别</div>
    </Container>
  );
};

export default Footer;

const Container = styled.div<{ $isPC: boolean }>`
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 10px;
  background-color: #fff;
  .inputContainer {
    
  }
  .tips {
    text-align: center;
    font-size: 12px;
    color: rgb(163, 163, 163);
    padding-top: 10px;
  }
`;

