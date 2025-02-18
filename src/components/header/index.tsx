import menuOpenImg from "@/assets/imgs/menuOpen.png";
import newChatImg from "@/assets/imgs/newChat.png";
import { Drawer } from "antd";
import { WideSidebar } from "../sideBar";
import { useState } from "react";
import { useChatStore } from "@/store";
const App = () => {
  const [collapse, setCollapse] = useState(false);
  const { createNewChat, answerStatus } = useChatStore.currentChat();
  const createNew = () => {
    if (answerStatus !== 2) {
      return;
    }
    createNewChat();
  };
  return (
    <div className="h-[56px] flex justify-between items-center px-4">
      <img
        src={menuOpenImg}
        alt="menu"
        className="w-6 h-6 cursor-pointer"
        onClick={() => setCollapse(true)}
      />
      <img
        src={newChatImg}
        alt="new chat"
        className="w-6 h-6 cursor-pointer"
        onClick={createNew}
      />
      <Drawer
        onClose={() => setCollapse(false)}
        placement="left"
        open={collapse}
        width={260}
        title={null}
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        <WideSidebar showTitle={true} close={() => setCollapse(false)} />
      </Drawer>
    </div>
  );
};

export default App;

