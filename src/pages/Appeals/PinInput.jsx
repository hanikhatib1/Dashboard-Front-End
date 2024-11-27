import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatePin } from "@/utiles/formatePin";
import PropTypes from "prop-types";

const PinInput = ({ label, setValue, value, register, name }) => {
  return (
    <div className="flex-1 flex flex-col gap-2">
      <Label className="text-body">{label}</Label>
      <Input
        className="rounded-[8px] h-[40px]"
        onChange={(e) => {
          setValue(name, e.target.value.split("-").join(""));
        }}
        value={formatePin(value)}
        /* {...register(name)} */
      />
    </div>
  );
};

PinInput.propTypes = {
  label: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  register: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

export default PinInput;
