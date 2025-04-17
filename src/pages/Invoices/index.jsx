import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import InvoicesTable from "./InvoicesTable";
import Pagination from "@/components/Pagination";
import EditInvoice from "./EditInvoice";
import DeleteInvoiceModel from "./DeleteInvoiceModel";
import { useGetAllInvoicesMutation } from "@/redux/apiSlice";
import { useSelector } from "react-redux";
import { invoicesTableData } from "./invoicesTableData";
import AddInvoice from "./AddInvoice";

const Invoices = () => {
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);

  const [getInvoices, { data: invoices, isError }] =
    useGetAllInvoicesMutation();
  const { editInvoiceData, deleteInvoiceData } = useSelector(
    (state) => state.invoices
  );
  const [status, setStatus] = useState({ status: "All", id: 0 });
  const [page, setPage] = useState(1);
  const [townshipId, setTownshipId] = useState(0);
  const [sortBy, setSortBy] = useState({
    name: "Date",
    value: "-id",
  });

  const fetchData = useCallback(async () => {
    await getInvoices(`search=${searchText}&page=${page}&sort=-id`);
  }, [getInvoices, searchText, page]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, status, page, townshipId, sortBy]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 bg-white rounded-[8px] m-4 p-4 shadow-custom">
        <div className="flex gap-4 justify-between items-center">
          <div className="flex gap-4 flex-1">
            <div className="rounded-[8px] border overflow-hidden relative h-[40px] w-full md:min-w-[400px] text-[#A1A1AA]">
              <Search
                className="absolute top-0 left-1 w-[20px] h-full z-10"
                color="#A1A1AA"
              />
              <Input
                type="Search"
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border-none pl-[30px] text-[#CCCDD2] bg-[#FCFCFC] outline-none focus:outline-offset-0 focus:outline-none absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
          <AddInvoice fetchData={fetchData} open={open} setOpen={setOpen} />
        </div>
        {/* <div className="flex gap-4">sort by</div> */}
        <div className="rounded-[8px] flex flex-col">
          {isError ? (
            "An error has occurred"
          ) : !invoices ? (
            <Loader />
          ) : (
            <>
              <InvoicesTable
                columns={invoicesTableData}
                invoices={invoices ? invoices : []}
              />
              <Pagination
                total_pages={invoices?.pagination?.total_pages}
                page={invoices?.pagination?.page}
                setPage={setPage}
              />
            </>
          )}
        </div>
      </div>
      {editInvoiceData && <EditInvoice fetchData={fetchData} />}
      {deleteInvoiceData && <DeleteInvoiceModel refetch={fetchData} />}
    </div>
  );
};

export default Invoices;
