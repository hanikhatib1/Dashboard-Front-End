import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  useAddStatusMutation,
  useGetAllStatusQuery,
  useUpdateStatusMutation,
} from "@/redux/apiSlice";
import React, { useEffect, useState } from "react";
import { Button } from "react-day-picker";
import DeleteStatusButton from "./DeleteStatusButton";

const AppealStatus = () => {
  const { data, isLoading, refetch } = useGetAllStatusQuery();
  const [statusText, setStatusText] = useState("");
  const [statusSort, setStatusSort] = useState(null);
  const [editStatus, setEditStatus] = useState(null);
  const { toast } = useToast();
  const [addStatus, { isLoading: isLoadingAddStatus }] = useAddStatusMutation();
  const [updateStatus, { isLoading: isLoadingUpdate }] =
    useUpdateStatusMutation();

  const handleAddStatus = async () => {
    try {
      const res = await addStatus({ status: statusText, sort: statusSort });
      if ("error" in res)
        toast({
          title: "Error",
          description: res.error.data.detail,
          variant: "error",
        });
      if ("data" in res) {
        toast({
          title: "Success",
          description: "Status added successfully",
          variant: "success",
        });
        setStatusText("");
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const res = await updateStatus({
        id: editStatus.id,
        body: { status: statusText, sort: statusSort },
      });
      if ("error" in res)
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "error",
        });
      if ("data" in res) {
        toast({
          title: "Success",
          description: "Status updated successfully",
          variant: "success",
        });
        setStatusText("");
        setEditStatus(null);
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (editStatus) {
      setStatusSort(editStatus.sort);
      setStatusText(editStatus.status);
    }
  }, [editStatus]);

  return (
    <div className="p-4 flex flex-col gap-6">
      <p className="text-heading_2 text-[#80838E]">Appeal Status</p>
      <div className="flex items-center gap-4">
        <Input
          className="w-[40%] rounded-[8px]"
          placeholder="Status"
          value={statusText ?? ""}
          onChange={(e) => setStatusText(e.target.value)}
        />
        <Input
          className="rounded-[8px] w-[120px]"
          placeholder="Sort"
          type="number"
          value={statusSort}
          onChange={(e) => setStatusSort(e.target.value)}
        />
        {editStatus ? (
          <>
            <Button
              className={`flex gap-2 items-center text-white rounded-[8px] bg-primary  px-4 py-2 ${statusText ? "" : "opacity-50"}`}
              disabled={statusText === ""}
              onClick={() => handleUpdateStatus()}
            >
              {isLoadingUpdate ? "Loading..." : "Update Status"}
            </Button>
            <Button
              className="flex gap-2 items-center text-primary rounded-[8px] border-primary border-[1px] bg-white px-4 py-2"
              onClick={() => {
                setEditStatus(null);
                setStatusText("");
                setStatusSort("");
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            className={`flex gap-2 items-center text-white rounded-[8px] bg-primary  px-4 py-2 ${statusText ? "" : "opacity-50"}`}
            disabled={statusText === ""}
            onClick={() => handleAddStatus()}
          >
            {isLoadingAddStatus ? "Loading..." : "Add Status"}
          </Button>
        )}
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        data && (
          <ul className="flex flex-col gap-3">
            {data.data.map((status) => (
              <li
                key={status.id}
                className="flex justify-between w-full border-b p-2"
              >
                <div className="flex gap-6 w-full">
                  <p className="w-[40%]">{status.status}</p>
                  <p>{status.sort}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex gap-2 items-center text-white rounded-[8px] bg-primary  px-4 py-2 cursor-pointer"
                    onClick={() => {
                      setEditStatus(status);
                    }}
                  >
                    Edit
                  </Button>
                  <DeleteStatusButton status={status} refetch={refetch} />
                </div>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

export default AppealStatus;
