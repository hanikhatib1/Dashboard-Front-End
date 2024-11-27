import { Label } from "@/components/ui/label";
import { Trash2, Upload } from "lucide-react";
import PropTypes from "prop-types";

const UploadFile = ({ file, setFile, setValue, title, _key }) => {
  return (
    <div className="cursor-pointer flex  gap-10 items-center">
      <div className="border w-max border-white hover:border-[#c3c8dd] rounded-[8px] overflow-hidden !cursor-pointer">
        <input
          type="file"
          className="hidden"
          id={title}
          onChange={(e) => {
            setFile(e.target.files[0]);
            setValue(_key, e.target.files[0]);
          }}
          accept=".pdf"
        />
        <Label
          htmlFor={title}
          className="flex gap-2 !p-1 !bg-white !text-black items-center cursor-pointer"
        >
          <Upload color="#80838E" />
          <p className="text-[16px] font-medium">{title}</p>
        </Label>
      </div>
      {file && (
        <div className="flex justify-between gap-4">
          <p className="text-body text-[#80838E]">{file.name}</p>
          <Trash2 color="#80838E" onClick={() => setFile(null)} />
        </div>
      )}
    </div>
  );
};

UploadFile.propTypes = {
  file: PropTypes.object,
  setFile: PropTypes.func,
  setValue: PropTypes.func,
  title: PropTypes.string,
};

export default UploadFile;
