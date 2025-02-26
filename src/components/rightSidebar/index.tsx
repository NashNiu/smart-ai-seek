import { useRightSidebar } from "@/store/ui";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import ZoomableImage from "../other/ZoomableImage";
const RightSidebar = () => {
  const { isRightSidebarOpen, toggleRightSidebar, fileInfo } =
    useRightSidebar();
  return (
    <div
      className={`${
        isRightSidebarOpen ? "w-[500px] p-2" : "w-0"
      } transition-all duration-300 pt-16 overflow-hidden box-border`}
    >
      <Card
        title={fileInfo.name}
        hoverable
        className="h-full"
        extra={
          <Button
            onClick={toggleRightSidebar}
            icon={<CloseOutlined className="text-red-500" />}
            type="text"
          />
        }
      >
        <div className="flex items-center justify-center gap-2 overflow-hidden">
          {fileInfo.url && <ZoomableImage src={"/apis/" + fileInfo.url} />}
        </div>
      </Card>
    </div>
  );
};

export default RightSidebar;

