import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import TownshipTable from "./TownshipTable";
import { columns, tableData } from "./TableData";
import { useGeTownshipMutation } from "@/redux/apiSlice";
import Loader from "@/components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setTownships } from "@/redux/features/Township";
import EditTownshipModal from "./EditTownshipModal";

const statusData = [
  {
    name: "All",
    value: "all",
    key: "all",
  },
  {
    name: "Not Scheduled",
    value: "non-scheduled",
    key: "non_scheduled",
  },
  {
    name: "Assessor Appeal Open",
    value: "assessor-appeal-open",
    key: "assessor_appeal_open",
  },
  {
    name: "Board Of Review Open",
    value: "board-of-review-open",
    key: "board_of_review_open",
  },
  {
    name: "Closed",
    value: "closed",
    key: "closed",
  },
];

const Township = () => {
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("all");
  const [getTownship] = useGeTownshipMutation();
  const [count, setCount] = useState(null);
  const dispatch = useDispatch();
  const { townships, editTownshipData } = useSelector(
    (state) => state.townships
  );

  useEffect(() => {
    async function fetchData() {
      const res = await getTownship(
        `search=${searchText}&filter=${status === "all" ? "" : status}`
      );
      if ("data" in res) {
        dispatch(setTownships(res.data));
        setCount(res.data.count);
      }
    }
    fetchData();
  }, [searchText, status]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 bg-white rounded-[8px] m-4 p-4 shadow-custom">
        <div className="flex justify-between items-center">
          <div className="rounded-[8px] overflow-hidden relative h-[40px] min-w-[400px] text-[#A1A1AA]">
            <Search
              className="absolute top-0 left-1 w-[20px] h-full z-10"
              color="#A1A1AA"
            />
            <Input
              type="Search"
              placeholder="Search"
              onChange={(e) => setSearchText(e.target.value)}
              className="border-none pl-[30px] text-[#CCCDD2] bg-[#FCFCFC] outline-none focus:outline-offset-0 focus:outline-none absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>
        <div className="flex gap-4">
          {count &&
            statusData.map((item) => (
              <Button
                key={item.value}
                className={`text-heading_2 font-bold p-0 bg-white hover:bg-transparent flex gap-1 w-max ${
                  status === item.key ? "border-primary " : "border-white"
                } border-b-[3px]`}
                onClick={() => setStatus(item.key)}
              >
                <span>{item.name}</span>
                <span className="text-[#80838E] ">
                  ( {count ? count[item.key] : ""} )
                </span>
              </Button>
            ))}
        </div>
        <div className="rounded-[8px] flex justify-center">
          {!townships ? (
            <Loader />
          ) : (
            <TownshipTable
              columns={columns}
              data={townships ? townships.data : []}
            />
          )}
        </div>
      </div>
      {editTownshipData && <EditTownshipModal />}
    </div>
  );
};

export default Township;
