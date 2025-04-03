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
import MigrateTownship from "./MigrateTownship";

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
  const [getTownship, { isLoading }] = useGeTownshipMutation();
  const [count, setCount] = useState(null);
  const dispatch = useDispatch();
  const { townships, editTownshipData, migrateTownshipData } = useSelector(
    (state) => state.townships
  );
  const [taps, setTaps] = useState(1);

  useEffect(() => {
    async function fetchData() {
      const res = await getTownship(
        `search=${searchText}&filter=${status === "all" ? "" : status}&past=${
          taps === 1 ? "true" : "false"
        }`
      );
      if ("data" in res) {
        dispatch(setTownships(res.data));
        setCount(res.data.count);
      }
    }
    fetchData();
  }, [searchText, status, taps]);

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
          <div>
            <button>Current</button>
            <button>Past</button>
          </div>
        </div>
        <div className="flex flex-col gap-3 border rounded-[8px] bg-[#F9FAFB]">
          <div className="border-b  flex gap-3">
            <button
              className={`p-3 ${
                taps === 1 ? "bg-[#53ABF9] bg-opacity-[0.2]" : "text-[#80838E]"
              }`}
              onClick={() => setTaps(1)}
            >
              Last Year
            </button>
            <button
              className={`p-3 ${
                taps === 0 ? "bg-[#53ABF9] bg-opacity-[0.2]" : "text-[#80838E]"
              }`}
              onClick={() => setTaps(0)}
            >
              This Year
            </button>
          </div>
          <div className="flex gap-4 p-2">
            {count &&
              statusData.map((item) => (
                <Button
                  key={item.value}
                  className={`text-heading_2 font-bold p-0 bg-[#F9FAFB] hover:bg-transparent flex gap-1 w-max ${
                    status === item.key ? "border-primary " : "border-[#F9FAFB]"
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
          {isLoading ? (
            <Loader className="h-[500px]" />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
      {editTownshipData && <EditTownshipModal isCurrentTownship={taps === 0} />}
      {migrateTownshipData && <MigrateTownship />}
    </div>
  );
};

export default Township;
