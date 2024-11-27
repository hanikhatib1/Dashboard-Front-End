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
  { name: "Date", value: "-id" },
  { name: "Name", value: "client_first_name" },
];

const SortBy = ({ setSortBy, sortBy }) => {
  return (
    <div className={`w-full flex flex-col gap-2 flex-2 h-[40px] sm:w-[20%]`}>
      <Select
        className="rounded-[8px] sm:w-[calc(50%-16px)] w-full"
        onValueChange={(value) =>
          setSortBy({
            name: SortByData.find((item) => item.value === value).name,
            value: value,   
          })
        }
      >
        <SelectTrigger className="rounded-[8px] h-[48px]">
          <SelectValue placeholder={`Sort By : ${sortBy.name}`}>
            Sort By : {sortBy.name}
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

SortBy.propTypes = {
  setSortBy: PropTypes.func,
  sortBy: PropTypes.object,
};

export default SortBy;
