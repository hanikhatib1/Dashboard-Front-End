import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import { useGetAllFilesUploadedMutation } from "@/redux/apiSlice";
import { format } from "date-fns";
import { Ban, Check, FileImage, RefreshCw } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const FilesUploaded = ({ currentUpload }) => {
  const [page, setPage] = useState(1);
  const [getAllFileUpload, { data, isLoading, refetch }] =
    useGetAllFilesUploadedMutation();

  /* useEffect(() => {
    const intervalId = setInterval(() => {
      getAllFileUpload({
        page,
      });
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [page, getAllFileUpload]); */

  useEffect(() => {
    getAllFileUpload({
      page,
    });
    window.scrollTo(0, 0);
  }, [page, getAllFileUpload]);

  return (
    <div className="w-full max-w-[750px]">
      {isLoading ? (
        <Loader />
      ) : (
        data && (
          <>
            <div className="flex items-center justify-end pb-6 gap-1 text-[#9B9B9B]">
              <div
                className="flex gap-1 items-center cursor-pointer"
                onClick={() =>
                  getAllFileUpload({
                    page,
                  })
                }
              >
                <RefreshCw />
                <p>Refresh</p>
              </div>
            </div>
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
            <Pagination
              page={data.pagination.current_page}
              setPage={setPage}
              total_pages={data.pagination.total_pages}
            />
          </>
        )
      )}
    </div>
  );
};

FilesUploaded.propTypes = {
  currentUpload: PropTypes.object,
};

export default FilesUploaded;
