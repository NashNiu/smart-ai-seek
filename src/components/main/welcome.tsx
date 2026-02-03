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
        <span>I'm SmartSeek, nice to meet you! </span>
      </h1>
      <p className="md:text-center md:text-base text-sm text-gray-500 mb-4 px-5">
        {" "}
        I can help you write code, read files, and create various creative content. Please give me your tasks~
      </p>
      <InputBox />
    </div>
  );
};

export default Welcome;
