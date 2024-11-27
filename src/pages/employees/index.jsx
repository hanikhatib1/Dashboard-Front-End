import { useEffect, useState } from "react";
import Card from "./Card";
import EmployeesTable from "./EmployeesTable";
import { columns, mockData } from "./mock-data";
import {
  useGetEmployeesMutation,
  useGetEmployeeStatusQuery,
} from "@/redux/apiSlice";
import Loader from "../../components/Loader";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";
import AddNewEmployeeModal from "./AddNewEmployeeModal";
import { useDispatch, useSelector } from "react-redux";
import { setEmployee } from "@/redux/features/Employee";
import EditEmployeeModal from "./EditEmployeeModal";

const Employees = () => {
  const [searchText, setSearchText] = useState("");
  const { editEmployeeData } = useSelector((state) => state.employee);
  const [page, setPage] = useState(1);
  const [getEmployees] = useGetEmployeesMutation();
  const { data: status, isLoading: statusLoading } = useGetEmployeeStatusQuery(
    {}
  );
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employee);
  useEffect(() => {
    async function fetchData() {
      const res = await getEmployees(
        `search=${searchText}&page=${page}`
      );
      if ("data" in res) {
        dispatch(setEmployee(res.data));
      }
    }
    fetchData();
  }, [searchText, page]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between gap-8 p-4">
        {statusLoading ? (
          <Loader />
        ) : (
          mockData.map((item, index) => (
            <Card
              Icon={item.Icon}
              title={item.title}
              count={status[item.value]}
              key={index}
            />
          ))
        )}
      </div>
      <div className="flex flex-col gap-6 bg-white rounded-[8px] m-4 p-4 shadow-custom">
        <div className="flex justify-between items-center">
          <div className="rounded-[8px] overflow-hidden relative h-[40px] min-w-[400px] text-[#A1A1AA]">
            <Search
              className="absolute top-0 left-1 w-[20px] h-full z-10"
              color="#A1A1AA"
            />
            <Input
              type="Search"
              placeholder="Search Employee"
              onChange={(e) => setSearchText(e.target.value)}
              className="border-none pl-[30px] bg-[#FCFCFC] outline-none focus:outline-offset-0 focus:outline-none absolute top-0 left-0 w-full h-full"
            />
          </div>
          <AddNewEmployeeModal />
        </div>
        <div className="rounded-[8px] flex justify-center">
          {employees ? (
            <EmployeesTable
              columns={columns}
              data={employees}
              setPage={setPage}
            />
          ) : (
            <Loader />
          )}
        </div>
      </div>
      {editEmployeeData && <EditEmployeeModal />}
    </div>
  );
};

export default Employees;
