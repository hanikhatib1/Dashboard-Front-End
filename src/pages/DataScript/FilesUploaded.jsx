import Loader from "@/components/Loader";
import { useGetAllFilesUploadedQuery } from "@/redux/apiSlice";
import { format } from "date-fns";
import { Ban, Check, FileImage } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const FilesUploaded = ({ currentUpload }) => {
  const [files, setFiles] = useState([]);
  const { data, isLoading, isSuccess, refetch } = useGetAllFilesUploadedQuery();
  /* useEffect(() => {
    if (isSuccess && data) {
      console.log(data.data);
      setFiles((prev) => [...prev, ...data.data]);
    }
  }, [data, isSuccess]); */

  /*  useEffect(() => {
    if (
      currentUpload !== null &&
      currentUpload !== undefined &&
      currentUpload.length
    ) {
      const cloneFiles = [...files];
      const index = cloneFiles.findIndex((e) => e.id === currentUpload[0].id);
      cloneFiles[index] = currentUpload;
      setFiles(cloneFiles);
    }
  }, [currentUpload.length]); */

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 5000); // 5000 milliseconds = 5 seconds

    // Don't forget to clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [refetch]);

  return (
    <div className="w-full max-w-[750px]">
      {isLoading ? (
        <Loader />
      ) : (
        data && (
          <ul className="flex flex-col gap-3 w-full">
            {currentUpload && (
              <li className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <FileImage
                    color={
                      currentUpload.status === "Cancelled"
                        ? "#EB5757"
                        : currentUpload.status === "UPLOADING"
                          ? "#9FD3ED"
                          : "#4693D6"
                    }
                    size={45}
                  />
                  <p className="font-normal">{currentUpload?.file?.name}</p>
                </div>
                {currentUpload.status === "UPDATED" && <Check />}
                {currentUpload.status === "UPLOADING" && (
                  <Loader className="!w-max" />
                )}
                {currentUpload.status === "Cancelled" && (
                  <Ban color="#EB5757" />
                )}
              </li>
            )}
            {data.data.map((file) => (
              <li key={file.id} className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <FileImage
                    color={
                      file.status === "Cancelled"
                        ? "#EB5757"
                        : file.status === "UPLOADING"
                          ? "#9FD3ED"
                          : "#4693D6"
                    }
                    size={45}
                  />
                  <div className="flex flex-col">
                    <p className="font-normal">{file.name}</p>
                    <p className="text-[12px] text-[#9B9B9B]">
                      {format(file.date, "MM/dd/yyyy hh:mm a")}
                    </p>
                  </div>
                </div>
                {file.status === "UPDATED" && <Check />}
                {file.status === "UPLOADING" && <Loader className="!w-max" />}
                {file.status === "Cancelled" && <Ban color="#EB5757" />}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

FilesUploaded.propTypes = {
  currentUpload: PropTypes.object,
};

export default FilesUploaded;
{
  /* {currentUpload && (
              <li className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <FileImage
                    color={
                      currentUpload.status === "Cancelled"
                        ? "#EB5757"
                        : currentUpload.status === "UPLOADING"
                          ? "#9FD3ED"
                          : "#4693D6"
                    }
                    size={45}
                  />
                  <p className="font-normal">{currentUpload?.file?.name}</p>
                </div>
                {currentUpload.status === "UPDATED" && <Check />}
                {currentUpload.status === "UPLOADING" && (
                  <Loader className="!w-max" />
                )}
                {currentUpload.status === "Cancelled" && (
                  <Ban color="#EB5757" />
                )}
              </li>
            )} */
}
