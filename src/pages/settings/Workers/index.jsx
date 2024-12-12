import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { useGetWorkersMutation } from "@/redux/apiSlice";
import { Search } from "lucide-react";
import React, { useEffect } from "react";
import WorkerCard from "./WorkerCard";
import AddWorkerModel from "./AddWorkerModel";
import DeleteWorkerModel from "./DeleteWorkerModel";
import EditWorkerModel from "./EditWorkerModel";

const Workers = () => {
  const [searchText, setSearchText] = React.useState("");
  const [deletedWorker, setDeletedWorker] = React.useState(null);
  const [editWorker, setEditWorker] = React.useState(null);
  const [getAllWorkers, { isLoading, isError, data }] = useGetWorkersMutation();

  useEffect(() => {
    async function fetchData() {
      await getAllWorkers(`search=${searchText}`);
    }
    fetchData();
  }, [getAllWorkers, searchText]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-14 bg-white rounded-[8px] m-4 p-4 shadow-custom">
        <div className="flex justify-between items-center">
          <div className="rounded-[8px] overflow-hidden relative h-[40px] min-w-[400px] text-[#A1A1AA]">
            <Search
              className="absolute top-0 left-1 w-[20px] h-full z-10"
              color="#A1A1AA"
            />
            <Input
              type="Search"
              placeholder="Search Workers"
              onChange={(e) => setSearchText(e.target.value)}
              className="border-none pl-[30px] bg-[#FCFCFC] outline-none focus:outline-offset-0 focus:outline-none absolute top-0 left-0 w-full h-full"
            />
          </div>
          <div className="flex gap-2">
            <AddWorkerModel refetch={getAllWorkers} />
          </div>
        </div>
        <div className="rounded-[8px] flex gap-4 flex-wrap">
          {isLoading ? (
            <Loader />
          ) : isError ? (
            "Error"
          ) : (
            data &&
            data.data.map((item) => (
              <WorkerCard
                key={item.id}
                worker={item}
                setDeletedWorker={setDeletedWorker}
                setEditWorker={setEditWorker}
              />
            ))
          )}
        </div>
      </div>
      {deletedWorker && (
        <DeleteWorkerModel
          deletedWorker={deletedWorker}
          setDeletedWorker={setDeletedWorker}
          refetch={getAllWorkers}
        />
      )}
      {editWorker && (
        <EditWorkerModel
          refetch={getAllWorkers}
          editWorkerData={editWorker}
          setEditWorker={setEditWorker}
        />
      )}
    </div>
  );
};

export default Workers;
