import collapseImg from "@/assets/imgs/collapse.png";
import deepSeekImg from "@/assets/imgs/deepseek.png";
import logoImg from "@/assets/imgs/logo.png";
import menuCloseImg from "@/assets/imgs/menuClose.png";
import newChatImg from "@/assets/imgs/newChat.png";
import openImg from "@/assets/imgs/open.png";
import { useUiStore, useChatStore } from "@/store";
import { Tooltip } from "antd";
import { useNavigate } from "react-router";
import { useMedia } from "react-use";
import styled from "styled-components";
import newChatBlue from "@/assets/imgs/newChatBlue.png";
import ChatList from "./chatList";
import { consts } from "@/utils";
// Expanded sidebar
interface WideSidebarProps {
  close: () => void;
  showTitle: boolean;
}
export const WideSidebar: React.FC<WideSidebarProps> = ({
  close,
  showTitle,
}) => {
  const navigate = useNavigate();
  const isPC = useMedia("(min-width: 768px)");
  const { createNewChat, answerStatus } = useChatStore.currentChat();
  const goHome = () => {
    navigate("/");
  };
  const createNew = () => {
    if (answerStatus !== consts.AnswerStatus.Ended) {
      return;
    }
    createNewChat();
    if (!isPC) {
      close();
    }
  };
  return (
    <WideContainer $showTitle={showTitle} $isPC={isPC}>
      <div className="title">
        <img src={deepSeekImg} onClick={goHome} className="w-[140px]" alt="" />
        <img
          src={isPC ? collapseImg : menuCloseImg}
          className="menuIcon"
          alt=""
          onClick={close}
        />
      </div>
      <div className="newChat">
        <div
          className={`btnBox ${
            answerStatus !== consts.AnswerStatus.Ended
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onClick={createNew}
        >
          <img src={newChatBlue} className="w-[24px]" alt="" />
          <span>Start New Chat</span>
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        <ChatList />
      </div>
    </WideContainer>
  );
};
const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const { collapse, openCollapse, closeCollapse } =
    useUiStore.useSidebarCollapse();

  const { createNewChat, answerStatus } = useChatStore.currentChat();
  const goHome = () => {
    navigate("/");
  };
  const createNew = () => {
    if (answerStatus !== consts.AnswerStatus.Ended) {
      return;
    }
    createNewChat();
  };
  return (
    <Container $collapse={collapse}>
      {collapse ? (
        <div className="menuBox">
          <img className="w-[28px]" src={logoImg} onClick={goHome} alt="" />
          <Tooltip title="Open Sidebar" placement="right">
            <img
              className="w-[28px]"
              src={openImg}
              alt=""
              onClick={openCollapse}
            />
          </Tooltip>
          <Tooltip title="Start New Chat" placement="right">
            <img
              className="w-[24px]"
              src={newChatImg}
              alt=""
              onClick={createNew}
            />
          </Tooltip>
        </div>
      ) : (
        <WideSidebar close={closeCollapse} showTitle={!collapse} />
      )}
    </Container>
  );
};

export default SideBar;

const Container = styled.div<{ $collapse: boolean }>`
  background-color: ${(props) => props.theme.colors.sidebarBg};
  width: ${(props) => (props.$collapse ? "68px" : "260px")};
  height: 100%;
  transition: all 0.3s;

  .menuBox {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 20px 10px;
    gap: 40px;
    img {
      cursor: pointer;
    }
  }
`;

const WideContainer = styled.div<{ $showTitle: boolean; $isPC: boolean }>`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .title {
    display: ${(props) => (props.$showTitle ? "flex" : "none")};
    justify-content: space-between;
    align-items: center;
    padding: 25px 10px 34px 20px;
    padding-bottom: ${(props) => (props.$isPC ? "34px" : "20px")};
    .deepSeek {
      width: 140px;
    }
    .menuIcon {
      width: ${(props) => (props.$isPC ? "28px" : "24px")};
    }
    img {
      cursor: pointer;
    }
  }
  .newChat {
    display: flex;
    height: 44px;
    padding-left: 18px;
    .btnBox {
      padding: 0 10px;
      color: ${(props) => props.theme.colors.primary};
      background-color: ${(props) => props.theme.colors.mainBg};
      display: flex;
      align-items: center;
      gap: 5px;
      border-radius: 14px;
    }
  }
`;
