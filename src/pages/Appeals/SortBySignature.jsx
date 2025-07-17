import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropTypes from "prop-types";

const SortByData = [
  { name: "none", value: "none" },
  { name: "Yes", value: true },
  { name: "No", value: false },
];

const SortBySignature = ({ setSortBySignature, sortBySignature }) => {
  return (
    <div className={`w-full flex flex-col gap-2 flex-2 h-[40px] sm:w-[20%]`}>
      <Select
        className="rounded-[8px] sm:w-[calc(50%-16px)] w-full"
        onValueChange={(value) => setSortBySignature(value)}
      >
        <SelectTrigger className="rounded-[8px] h-[48px]">
          <SelectValue
            placeholder={`Sort By Signature Sent: ${sortBySignature === "none" ? sortBySignature : sortBySignature ? "Yes" : "No"}`}
          >
            Sort By Signature Sent : {sortBySignature ? "Yes" : "No"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-[8px] bg-white ">
          <SelectGroup className="">
            {SortByData.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="text-body mx-2 hover:bg-gray-100 cursor-pointer"
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

SortBySignature.propTypes = {
  setSortBySignature: PropTypes.func,
  sortBySignature: PropTypes.object,
};

export default SortBySignature;
