import InputBox from "./inputBox";

const Welcome = () => {
  return (
    <div className="px-2">
      <h1 className="md:text-center md:text-3xl md:font-bold text-2xl mb-4">
        {" "}
        我是 SmartSeek，很高兴见到你！{" "}
      </h1>
      <p className="md:text-center md:text-base text-sm text-gray-500 mb-4">
        {" "}
        我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~
      </p>
      <InputBox />
    </div>
  );
};

export default Welcome;
