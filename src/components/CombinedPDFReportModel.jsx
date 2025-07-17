import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Plus } from "lucide-react";
import { useGetReportDataMutation } from "@/redux/apiSlice";
import PropTypes from "prop-types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import CookCountyAssessorpdf from "./CookCountyAssessorpdf";

const CombinedPDFReportModel = ({ mainPin, pins }) => {
  const [getReportData, { isLoading, data }] = useGetReportDataMutation();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();
  const currentDate = `${currentMonth + 1}/${currentDay}/${currentYear}`;
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");

  const fetchReportData = async () => {
    await getReportData({
      comparable_property_pin: mainPin,
      pins: pins.slice(0, 8),
    });
  };

  useEffect(() => {
    fetchReportData();
  }, [pins]);

  console.log("data", data);

  return (
    <Dialog defaultOpen={open} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="!flex-1">
        <Button
          className={`bg-primary rounded-[8px] text-white flex justify-center items-center gap-1 `}
          onClick={() => setOpen(true)}
        >
          <Plus color="#ffffff" />
          <p> Cook County Assessor</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-w-[calc(100%-32px)] max-h-[calc(100vh-20%)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <DialogHeader>
          <DialogTitle className="text-heading_1">
            Cook County Assessor
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 flex-1">
          <label htmlFor="Number">Client Name:</label>
          <input
            type="text"
            className="rounded-[8px] h-[32px] p-3"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>
        {data && pins.length !== 0 && (
          <PDFDownloadLink
            document={
              <CookCountyAssessorpdf
                reportData={data.data}
                clientName={clientName}
              />
            }
            fileName="CookCounty_Appeal.pdf"
            className="w-full"
          >
            <div
              className={`flex gap-2 !p-1 !bg-white !text-black items-center ${data.data ? "cursor-pointer hover:border-gray-400 rounded-[8px] overflow-hidden" : ""} border border-white `}
            >
              <Download color="#80838E" />{" "}
              <p
                className={`text-[16px] font-medium ${data.data ? "" : "text-[#80838E]"}`}
              >
                Cook County Assessor
              </p>
            </div>
          </PDFDownloadLink>
        )}
      </DialogContent>
    </Dialog>
  );
};

CombinedPDFReportModel.propTypes = {
  mainPin: PropTypes.string,
  pins: PropTypes.array.isRequired,
};

export default CombinedPDFReportModel;
