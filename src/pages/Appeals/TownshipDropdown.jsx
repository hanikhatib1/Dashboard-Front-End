import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllStatusQuery, useGeTownshipMutation } from "@/redux/apiSlice";
import PropTypes from "prop-types";
import { useEffect } from "react";

const TownshipDropdown = ({ setTownshipId, className = "" }) => {
  const [getTownship, { data: allTownship, isLoading, isError }] =
    useGeTownshipMutation();

  useEffect(() => {
    getTownship();
  }, []);

  if (isLoading) return null;

  if (isError) return "An error has occurred";

  return (
    <div className={`w-full flex flex-col gap-2 flex-2 h-[40px] sm:w-[20%]`}>
      <Select
        className="rounded-[8px] sm:w-[calc(50%-16px)] w-full"
        onValueChange={(value) => setTownshipId(value)}
      >
        <SelectTrigger className="rounded-[8px] h-[48px] p-1">
          <SelectValue placeholder="Select Township" />
        </SelectTrigger>
        <SelectContent className="rounded-[8px] bg-white ">
          <SelectGroup className="">
            <SelectItem
              value={0}
              className="text-body mx-2 hover:bg-gray-100 cursor-pointer"
            >
              All
            </SelectItem>
            {allTownship &&
              allTownship.data.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.id}
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

export default TownshipDropdown;
