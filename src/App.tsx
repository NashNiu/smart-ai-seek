import Header from "@/components/header";
import Main from "@/components/main";
import SideBar from "@/components/sideBar";
import { SocketContext, useSocket } from "@/hooks";
import { useEffect } from "react";
import RightSidebar from "@/components/rightSidebar";
function App() {
  const { initSocket, sendMessage, socket } = useSocket();
  useEffect(() => {
    initSocket();
  }, []);
  return (
    <SocketContext.Provider value={{ socket, sendMessage }}>
      <div className="h-screen overflow-hidden flex flex-col bg-white">
        {/* header */}
        <div className="md:hidden">
          <Header />
        </div>
        {/* main */}
        <div className="flex flex-1 overflow-hidden">
          {/* sidebar */}
          <div className="hidden md:block">
            <SideBar />
          </div>
          <div className="flex-1 overflow-hidden flex">
            <Main />
            <RightSidebar />
          </div>
        </div>
      </div>
    </SocketContext.Provider>
  );
}

export default App;
