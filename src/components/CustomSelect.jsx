import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CustomSelect = ({ value, setValue }) => {
  return (
    <Popover>
      <PopoverTrigger asChild className="w-full border">
        <Button
          variant={"outline"}
          className={cn(
            "w-full h-[48px] rounded-[8px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "MM-dd-yyyy") : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(e) => {
            /* setValue("after_bor_appeal_end", format(e, "yyyy-MM-dd")); */
            setValue(e);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

CustomSelect.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
};

export default CustomSelect;
