
const Card = ({ title, count, Icon }) => {
  return (
    <div className="flex justify-between items-center flex-1 text-start p-4 bg-white rounded-xl shadow-custom">
      <div className="flex flex-col gap-2">
        <p className="font-[700] text-[24px] leading-[32px] text-[#00061DCC]">
          {title}
        </p>
        <p className="font-[700] text-[28px] leading-[32px] text-black">
          {count}
        </p>
      </div>
      {Icon}
    </div>
  );
};

export default Card;
