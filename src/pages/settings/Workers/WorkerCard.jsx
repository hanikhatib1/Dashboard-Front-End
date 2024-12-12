import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const WorkerCard = ({ worker, setDeletedWorker, setEditWorker }) => {
  return (
    <div className="border border-[#4693D6] rounded-[8px] p-4 w-[320px] relative">
      <div className="flex flex-col gap-6 ">
        <div className="flex items-center gap-4">
          <img
            src={worker.image}
            alt="avatar"
            className="w-[70px] h-[70px] rounded-full border border-[#E0E0E0]"
          />
          <div className="flex flex-col">
            <h1 className="font-semibold text-dark text-[20px]">
              {worker.first_name} {worker.last_name}
            </h1>
            <p className="text-[#465668] text-[16px]">{worker.job_title}</p>
          </div>
        </div>
        <p className="text-[#465668] text-[16px]">{worker.description}</p>
      </div>
      <div className="absolute top-0 cursor-pointer right-0 w-[40px] h-[40px] flex justify-center items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="!bg-white min-w-[180px]">
            <DropdownMenuItem
              className="hover:bg-slate-100 cursor-pointer"
              onClick={() => setEditWorker(worker)}
            >
              Edit{" "}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setDeletedWorker(worker)}
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

WorkerCard.propTypes = {
  worker: PropTypes.object,
  setDeletedWorker: PropTypes.func,
  setEditWorker: PropTypes.func,
};

export default WorkerCard;
