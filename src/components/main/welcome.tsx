import InputBox from "./inputBox";
import logoImg from "@/assets/imgs/logo.png";
const Welcome = () => {
  return (
    <div className="px-2 translate-y-[-30%]">
      <h1 className="md:text-center md:text-3xl md:font-bold md:flex-row md:justify-center md:items-center text-xl mb-3 flex gap-2 flex-col px-5">
        <img
          src={logoImg}
          className="md:w-[44px] md:h-[44px] w-[30px] h-[30px]"
          alt=""
        />{" "}
        <span>我是 SmartSeek，很高兴见到你！ </span>
      </h1>
      <p className="md:text-center md:text-base text-sm text-gray-500 mb-4 px-5">
        {" "}
        我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~
      </p>
      <InputBox />
    </div>
  );
};

export default Welcome;
