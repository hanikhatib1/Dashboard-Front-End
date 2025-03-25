import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "date-fns";
import { MoreVertical } from "lucide-react";
import PropTypes from "prop-types";

const ReportCard = ({ report, setEditReport, setDeletedReport }) => {
  return (
    <div className="p-3 relative border rounded-[12px] flex flex-col gap-3 w-[340px]">
      <p className="text-[#2C3E50] font-[700] text-[20px]">
        {report.full_name}
      </p>
      <p className="text-[#2C3E50] font-[500] text-[16px]">
        {report.description}
      </p>
      <div
        className={`${report.image ? "" : "!bg-[#CCCDD2]"}  bg-gray-100 w-full h-[100px] rounded-[8px] overflow-hidden`}
      >
        {report.image && <img src={report.image} alt="" />}
      </div>
      <div className="absolute top-0 cursor-pointer right-0 w-max h-[40px] flex justify-center items-center">
        <p className="text-[10px] bg-[#1A73E833] p-1 rounded-[12px]">
          Status: {report.status}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 flex justify-center items-center cursor-pointer"
            >
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="!bg-white min-w-[180px]">
            <DropdownMenuItem
              className="hover:bg-slate-100 cursor-pointer"
              onClick={() => setEditReport(report)}
            >
              Edit{" "}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setDeletedReport(report)}
              className="hover:bg-slate-100 cursor-pointer text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

ReportCard.propTypes = {
  report: PropTypes.object.isRequired,
  setEditReport: PropTypes.func.isRequired,
  setDeletedReport: PropTypes.func.isRequired,
};

export default ReportCard;
