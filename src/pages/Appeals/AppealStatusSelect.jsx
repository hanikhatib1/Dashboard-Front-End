import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllStatusQuery } from "@/redux/apiSlice";
import PropTypes from "prop-types";

const AppealStatusSelect = ({
  status,
  setStatus,
  setValue,
  keyOfValue = "appeal_status_id",
  staticStatus,
  className = "sm:w-[30%]",
}) => {
  const { data: allStatus, isLoading, isError } = useGetAllStatusQuery();

  if (isLoading) return null;

  if (isError) return "An error has occurred";

  return (
    <div className={`w-full flex flex-col gap-2 flex-2 h-[40px] ${className}`}>
      <Select
        className="rounded-[8px] sm:w-[calc(50%-16px)] w-full"
        onValueChange={(value) => {
          if (setValue) setValue(keyOfValue, value);
          if (value === 0) return setStatus(staticStatus);

          const selectedStatus = allStatus.data.find((s) => s.id == value);
          setStatus(selectedStatus);
        }}
      >
        <SelectTrigger className="rounded-[8px] h-[48px]">
          <SelectValue
            placeholder={`Status : ${staticStatus ? staticStatus.status : "New"}`}
          >
            Status : {status.status}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-[8px] bg-white ">
          <SelectGroup className="">
            {staticStatus && (
              <SelectItem
                value={staticStatus.id}
                className="text-body mx-2 hover:bg-gray-100 cursor-pointer"
              >
                {staticStatus.status}
              </SelectItem>
            )}
            {allStatus &&
              allStatus.data.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.id}
                  className="text-body mx-2 hover:bg-gray-100 cursor-pointer"
                >
                  {item.status}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

AppealStatusSelect.propTypes = {
  status: PropTypes.object,
  setStatus: PropTypes.func,
  setValue: PropTypes.func,
  keyOfValue: PropTypes.string,
  staticStatus: PropTypes.object,
  className: PropTypes.string,
};

export default AppealStatusSelect;
