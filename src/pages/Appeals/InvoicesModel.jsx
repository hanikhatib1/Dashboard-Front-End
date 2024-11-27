import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { setAppealInvoiceDetails } from "@/redux/features/AppealSlice";
import { DialogTitle } from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InvoicesTable from "../Invoices/InvoicesTable";
import { invoicesTableData } from "../Invoices/invoicesTableData";
import { useGetInvoiceFromAppealMutation } from "@/redux/apiSlice";
import Loader from "@/components/Loader";

const InvoicesModel = () => {
  const { appealInvoiceDetails } = useSelector((state) => state.appeals);
  const dispatch = useDispatch();
  const [getInvoices, { isError, isLoading }] =
    useGetInvoiceFromAppealMutation();
  const [invoices, setInvoice] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (appealInvoiceDetails) {
        const res = await getInvoices(appealInvoiceDetails.id);
        if ("error" in res) return;
        if ("data" in res) {
          let newInvoices = [];
          res.data.data.filter((item) => {
            newInvoices.push({ ...item, appeal_id: item.appeal.id });
          });
          console.log(newInvoices);
          setInvoice(newInvoices);
        }
      }
    }
    fetchData();
  }, [appealInvoiceDetails, getInvoices]);

  return (
    <Dialog
      open={appealInvoiceDetails}
      defaultOpen={appealInvoiceDetails}
      onOpenChange={(open) => dispatch(setAppealInvoiceDetails(open))}
    >
      <DialogContent className="w-max min-w-[500px] bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Appeal Invoices</DialogTitle>
        </DialogHeader>
        <div>
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <p>Something went wrong</p>
          ) : (
            invoices && (
              <InvoicesTable
                columns={invoicesTableData}
                invoices={invoices ? { data: invoices } : []}
              />
            )
          )}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-primary rounded-[8px]  text-white"
            onClick={() => dispatch(setAppealInvoiceDetails(null))}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicesModel;
