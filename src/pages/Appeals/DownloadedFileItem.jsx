import {  Trash2, X } from "lucide-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const DownloadedFileItem = ({
  title,
  file,
  deletedFileValue,
  setValue,
  deletedFileKey,
}) => {
  return (
    <div className="flex gap-2 justify-between w-full">
      <p>{title}</p>
      <div className="flex items-center gap-6">
        <Link
          to={`${file.link}`}
          target="_blank"
          className="text-primary underline"
        >
          view
        </Link>
        {deletedFileValue ? (
          <X
            color="#80838E"
            className="cursor-pointer"
            onClick={() => {
              setValue(deletedFileKey, "");
            }}
          />
        ) : (
          <Trash2
            color="#80838E"
            className="cursor-pointer"
            onClick={() => {
              setValue(deletedFileKey, file.real_id);
            }}
          />
        )}
      </div>
    </div>
  );
};

DownloadedFileItem.propTypes = {
  title: PropTypes.string,
  file: PropTypes.object,
  deletedFileValue: PropTypes.string,
  setValue: PropTypes.func,
  deletedFileKey: PropTypes.string,
};

export default DownloadedFileItem;
