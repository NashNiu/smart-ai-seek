import styled from "styled-components";
import Footer from "./footer";
import { useChatStore } from "@/store";
import MsgBox from "./msgBox";
import Welcome from "./welcome";
const Main = () => {
  const { items, id } = useChatStore.currentChat();
  const { list } = useChatStore.chatList();
  const title = list.find((item) => item.id === id)?.title || "";
  return (
    <div className="flex flex-col md:pt-5 pt-5 relative max-w-[800px] mx-auto h-full justify-center">
      {items.length === 0 ? (
        <Welcome />
      ) : (
        <>
          <Title className="title md:block hidden">{title}</Title>
          <div className="flex-1 overflow-auto">
            <MsgBox />
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};
export default Main;

const Title = styled.div`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  max-width: 800px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  text-align: center;
  height: 36px;
`;

