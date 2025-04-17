import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AppealsTable from "./AppealsTable";
import { appealsColumns } from "./appealsTableData";
import { useGetAppealsMutation } from "@/redux/apiSlice";
import NewAppeals from "./NewAppeals";
import EditAppeal from "./EditAppeal";
import { useDispatch, useSelector } from "react-redux";
import AppealStatusSelect from "./AppealStatusSelect";
import queryString from "query-string";
import Pagination from "@/components/Pagination";
import TownshipDropdown from "./TownshipDropdown";
import SortBy from "./SortBy";
import DeleteAppealModel from "./DeleteAppealModel";
import AddInvoice from "../Invoices/AddInvoice";
import { addAppealToInvoice } from "@/redux/features/AppealSlice";
import InvoicesModel from "./InvoicesModel";
import EditInvoice from "../Invoices/EditInvoice";
import DeleteInvoiceModel from "../Invoices/DeleteInvoiceModel";
import SendFormModel from "./SendFormModel";
import DocumentsStatusAppealModel from "./DocumentsStatusAppealModel";

const Appeals = () => {
  const [searchText, setSearchText] = useState("");
  const [getAppeals, { data: appeals, isError }] = useGetAppealsMutation();
  const dispatch = useDispatch();
  const {
    editAppealData,
    deleteAppealData,
    appealToInvoice,
    appealInvoiceDetails,
    formsAppeal,
    documentsStatusAppealModel,
  } = useSelector((state) => state.appeals);
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
    const filterObject = {
      appeal_status_id: status.id,
      township_id: townshipId,
    };
    Object.keys(filterObject).forEach((key) => {
      if (!filterObject[key]) delete filterObject[key];
    });
    await getAppeals(
      `search=${searchText}&sort=${sortBy.value}&limit=10&page=${page}&filters=${JSON.stringify(filterObject)}`
    );
  }, [status.id, townshipId, getAppeals, searchText, sortBy, page]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, status, page, townshipId, sortBy]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 bg-white rounded-[8px] m-4 p-4 shadow-custom">
        <div className="flex gap-3 justify-between items-center">
          <div className="flex gap-4 w-full md:flex-1 max-w-[400px]">
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
          <NewAppeals fetchData={fetchData} hasIcon={false} />
        </div>
        <div className="flex gap-4">
          <AppealStatusSelect
            status={status}
            setStatus={setStatus}
            staticStatus={{ status: "All", id: 0 }}
            className="sm:w-[20%]"
          />
          <TownshipDropdown setTownshipId={setTownshipId} />
          <SortBy setSortBy={setSortBy} sortBy={sortBy} />
        </div>
        <div className="rounded-[8px] flex flex-col">
          {isError ? (
            "An error has occurred"
          ) : !appeals ? (
            <Loader />
          ) : (
            <>
              <AppealsTable
                columns={appealsColumns}
                appeals={appeals ? appeals : []}
              />
              <Pagination
                total_pages={appeals?.pagination?.total_pages}
                page={appeals?.pagination?.page}
                setPage={setPage}
              />
            </>
          )}
        </div>
      </div>
      {editAppealData && <EditAppeal fetchData={fetchData} />}
      {deleteAppealData && <DeleteAppealModel refetch={fetchData} />}
      {appealToInvoice && (
        <AddInvoice
          hideButton={true}
          open={appealToInvoice}
          setOpen={(e) => dispatch(addAppealToInvoice(e))}
        />
      )}
      {appealInvoiceDetails && <InvoicesModel />}

      {editInvoiceData && <EditInvoice />}
      {deleteInvoiceData && <DeleteInvoiceModel />}
      {formsAppeal && <SendFormModel />}
      {documentsStatusAppealModel && <DocumentsStatusAppealModel />}
    </div>
  );
};

export default Appeals;
