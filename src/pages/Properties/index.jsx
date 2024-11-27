import SearchPropertiesComponent from "./SearchProperties";

const Properties = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 rounded-[8px] m-4 p-4 bg-[#FCFCFC]">
        <div className="flex justify-between items-center">
          <SearchPropertiesComponent />
        </div>
      </div>
    </div>
  );
};

export default Properties;
