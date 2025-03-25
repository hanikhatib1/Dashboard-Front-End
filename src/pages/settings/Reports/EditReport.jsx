import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  useGetConstantsQuery,
  useUpdateReportMutation,
} from "@/redux/apiSlice";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

const EditReport = ({ editReportData, setEditReport, refetch }) => {
  const [editReport, { isLoading, reset }] = useUpdateReportMutation();
  const { data, isLoading: isLoadingConstants } = useGetConstantsQuery();
  const { toast } = useToast();

  const {
    register,
    setValue,
    formState: { isValid },
    watch,
    handleSubmit,
  } = useForm({
    defaultValues: {
      status: "",
    },
  });

  const onSubmit = async (data) => {
    const res = await editReport({ body: data, id: editReportData.id });
    if ("data" in res) {
      reset();
      toast({
        title: "Worker Edited",
        description: "Report has been edited successfully",
        type: "success",
      });
      refetch();
      setEditReport(false);
    }
    if ("error" in res) {
      toast({
        title: "Error",
        description: res.error.data.detail,
        type: "error",
      });
    }
  };

  return (
    <Dialog
      defaultOpen={editReportData}
      open={editReportData}
      onOpenChange={(open) => setEditReport(open)}
    >
      <DialogContent className="sm:max-w-[500px] !p-0 !border-none max-h-[calc(100vh-20%)] bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <div>
          <form
            className="flex flex-col gap-6 mb-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="p-4 flex flex-col gap-6">
              <p>Edit Report</p>
              <div className="sm:w-[calc(50%-8px)] w-full flex flex-col gap-2 flex-2">
                <label htmlFor="Disabled" className="text-body text-[#80838E]">
                  Status
                </label>
                <Select onValueChange={(e) => setValue("status", e)}>
                  <SelectTrigger className="w-full h-[48px] rounded-[8px]">
                    <SelectValue
                      placeholder={
                        watch("status")
                          ? watch("status")
                          : editReportData.status
                      }
                    >
                      {watch("status")
                        ? watch("status")
                        : editReportData.status}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      {data &&
                        data.report_status.map((item, index) => (
                          <SelectItem key={index} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-4 px-8">
              <div className="flex gap-4">
                <Button
                  className="bg-primary text-white rounded-[8px]"
                  disabled={!isValid}
                  type="submit"
                >
                  {isLoading ? "Loading..." : "Update Report"}
                </Button>
                <Button
                  className="bg-white text-primary rounded-[8px] border border-primary hover:text-white"
                  onClick={() => {
                    setEditReport(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

EditReport.propTypes = {
  editReportData: PropTypes.object,
  setEditReport: PropTypes.func,
  refetch: PropTypes.func,
};

export default EditReport;
