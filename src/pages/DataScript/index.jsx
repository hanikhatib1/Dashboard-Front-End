import { Button } from "@/components/ui/button";
import { PropertyIcon } from "../../assets/Icons";
import { CloudUpload, Wallpaper } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  useImportAppealHistoryMutation,
  useUploadPropertiesMutation,
  useUploadSalesDataMutation,
  useUploadTaxRateDataMutation,
} from "@/redux/apiSlice";
import FilesUploaded from "./FilesUploaded";

const feature = [
  {
    id: 1,
    title: "Import Property Data",
    icon: <PropertyIcon />,
  },
  {
    id: 2,
    title: "Import Property Sales Data ",
    icon: <Wallpaper color="white" />,
  },
  {
    id: 3,
    title: "Import Tax Rate Data ",
    icon: <PropertyIcon />,
  },
  {
    id: 4,
    title: "Upload Appeal History",
    icon: <Wallpaper color="white" />,
  },
];

const DataScript = () => {
  const [files, setFiles] = useState(null);
  const [activeUpload, setActiveUpload] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentUpload, setCurrentUpload] = useState([]);

  const [uploadPropertyData] = useUploadPropertiesMutation();
  const [uploadSalesData] = useUploadSalesDataMutation();
  const [uploadTaxRateData] = useUploadTaxRateDataMutation();
  const [uploadAppealHistory] = useImportAppealHistoryMutation();

  const handleUploadFile = useCallback(async () => {
    const formData = new FormData();
    formData.append("file", files);
    let res;
    setIsLoading(true);
    switch (activeUpload) {
      case 1:
        res = await uploadPropertyData(formData);
        break;
      case 2:
        res = await uploadSalesData(formData);
        break;
      case 3:
        res = await uploadTaxRateData(formData);
        break;
      case 4:
        res = await uploadAppealHistory(formData);
        break;
      default:
        break;
    }
    setIsLoading(false);
    if ("error" in res) setIsError(true);
  }, [
    files,
    activeUpload,
    uploadPropertyData,
    uploadSalesData,
    uploadTaxRateData,
    uploadAppealHistory,
  ]);

  useEffect(() => {
    if (files) {
      setCurrentUpload([
        {
          id: files.name + Math.random(),
          name: files.name,
          status: isLoading ? "UPLOADING" : isError ? "Cancelled" : "UPDATED",
        },
      ]);
      handleUploadFile();
    }
  }, [files, handleUploadFile]);

  return (
    <div className="p-4 flex flex-col gap-12 items-center">
      <div className="flex flex-col md:flex-row justify-center gap-5 md:gap-20 ">
        {feature.map((item, index) => (
          <Button
            key={index}
            onClick={() => {
              setFiles(null);
              setActiveUpload(item.id);
            }}
            className={`flex justify-start items-center gap-2 p-4 rounded-lg !bg-inherit !text-primary ${activeUpload === item.id ? "[&_li]:!bg-green-500 !text-[#53ABF9]" : ""} hover:!text-[#53ABF9] [&_li]:hover:!bg-green-500`}
          >
            <li className="bg-primary w-[50px] h-[50px] rounded-full flex justify-center items-center">
              {item.icon}
            </li>
            <p className="!text-inherit">{item.title}</p>
          </Button>
        ))}
      </div>
      <div className="flex text-center justify-center items-center flex-col gap-6 p-20 border border-dashed max-w-[750px] w-full md:w-[750px] rounded-[16px]">
        <CloudUpload size={80} color="#999999" />
        <div>
          <p className="text-[#00061D] text-[18px] font-semibold">
            Select a file or drag and drop here
          </p>
          <p className="text-[#80838E]">Excel File only</p>
        </div>

        <label
          htmlFor="file"
          className="font-normal  text-[18px] p-2 border-[2px] border-primary rounded-[8px]"
        >
          Select file
        </label>
        <input
          type="file"
          name=""
          id="file"
          className="hidden"
          onChange={(e) => setFiles(e.target.files[0])}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
      </div>
      <FilesUploaded
        currentUpload={{
          file: { name: files?.name },
          status: isLoading ? "UPLOADING" : isError ? "Cancelled" : "UPDATED",
        }}
      />
    </div>
  );
};

export default DataScript;
