import { Search } from "lucide-react";
import AddNewClientModal from "./AddNewClientModal";
import { Input } from "../../components/ui/input";
import ClientsTable from "./ClientsTable";
import { columns } from "./dataTable";
import { useGetClientsMutation } from "@/redux/apiSlice";
import { useCallback, useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setClients } from "@/redux/features/Clients";
import EditClientModal from "./EditClientModal";

const Client = () => {
  const [searchText, setSearchText] = useState("");
  const [getClients] = useGetClientsMutation();
  const dispatch = useDispatch();
  const { clients, editClientData } = useSelector((state) => state.clients);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    const res = await getClients(`sort=-id&search=${searchText}&page=${page}`);
    if ("data" in res) dispatch(setClients(res.data));
  }, [dispatch, getClients, searchText, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData, searchText]);

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
              placeholder="Search Client"
              onChange={(e) => setSearchText(e.target.value)}
              className="border-none pl-[30px] bg-[#FCFCFC] outline-none focus:outline-offset-0 focus:outline-none absolute top-0 left-0 w-full h-full"
            />
          </div>
          <div className="flex gap-2">
            <AddNewClientModal />
          </div>
        </div>
        <div className="rounded-[8px] ">
          {clients ? (
            <ClientsTable columns={columns} data={clients} setPage={setPage} />
          ) : (
            <Loader />
          )}
        </div>
      </div>
      {editClientData && <EditClientModal />}
    </div>
  );
};

export default Client;
