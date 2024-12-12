import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAddReplayMutation, useGetAllReplaysQuery } from "@/redux/apiSlice";
import { setReplayContactData } from "@/redux/features/ContactUs";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const AddReplayModal = ({ refetch }) => {
  const { replayContactData } = useSelector((state) => state.contactUs);
  const dispatch = useDispatch();
  const [addReplay, { isLoading }] = useAddReplayMutation();
  const { toast } = useToast();
  const { data, isLoading: replayLoading } = useGetAllReplaysQuery(
    `filters={"contact_us_id":${replayContactData.id}}`
  );
  const { register, handleSubmit } = useForm({
    defaultValues: {
      subject: "",
      reply: "",
      contact_us_id: replayContactData.id,
    },
  });

  const onSubmit = async (data) => {
    data.reply = `<!DOCTYPE html>\n<html>\n<head>\n    <meta charset="UTF-8">\n    <title>${data.subject}</title>\n</head>\n<body style="font-family: Arial, sans-serif; line-height: 1.6;">\n    <p> ${data.reply}</p>\n</body>\n</html>`;

    const res = await addReplay(data);
    if ("data" in res) {
      refetch();
      toast({
        title: "Replay Added",
        message: "Replay has been added successfully",
      });
      dispatch(setReplayContactData(false));
    } else {
      toast({
        title: "Error",
        message: res.error.message,
        type: "error",
      });
    }
  };

  return (
    <Dialog
      defaultOpen={replayContactData}
      open={replayContactData}
      onOpenChange={(open) => dispatch(setReplayContactData(open))}
    >
      <DialogContent className="sm:max-w-[500px] !p-0 !border-none max-h-[calc(100vh-20%)] bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <div className="p-6 border-b ">
          <p className="text-dark text-[16px]">{replayContactData.full_name}</p>
          <p>
            <span className="text-[#AEAEAE] text-[11px]">From : </span>
            <span className="text-dark text-[11px]">
              {replayContactData.email}
            </span>
          </p>
        </div>
        <div className="px-6 py-3">
          <p className="text-dark text-[12px]">{replayContactData.subject}</p>
        </div>

        {replayLoading ? (
          <Loader />
        ) : (
          data &&
          data.data.length > 0 && (
            <div className="p-6">
              {data.data.map((item, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <p className="text-dark text-[12px]">{item.subject}</p>
                  <div dangerouslySetInnerHTML={{ __html: item.reply }} />
                </div>
              ))}
            </div>
          )
        )}

        <form
          className="flex flex-col gap-6 mb-8 px-6 border-t pt-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {" "}
          <div className="w-full flex flex-col gap-2 flex-2 ">
            <label
              htmlFor="Short_description"
              className="text-body text-[#80838E]"
            >
              Subject
            </label>
            <Input
              id="Short_description"
              type="text"
              className="rounded-[8px] h-[48px]"
              {...register("subject", { required: true })}
            />
          </div>
          <div className="w-full flex flex-col gap-2 flex-2 ">
            <label htmlFor="Description" className="text-body text-[#80838E]">
              Replay
            </label>
            <Textarea
              id="Description"
              type=""
              className="rounded-[8px] h-[48px]"
              {...register("reply", { required: true })}
            />
          </div>
          <div className="flex gap-5">
            <Button
              type="button"
              className="w-[200px]  rounded-[8px] bg-white text-primary self-start border border-primary hover:bg-white hover:text-primary"
              onClick={() => dispatch(setReplayContactData(false))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-[200px]  rounded-[8px] bg-primary text-white self-start"
            >
              {isLoading ? "Loading..." : "Add Replay"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReplayModal;
