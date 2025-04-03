import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { format, set } from "date-fns";
import {
  useEditCurrentTownshipMutation,
  useEditTownshipMutation,
} from "../../redux/apiSlice";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import "react-day-picker/style.css";

import { cn } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/Loader";
import {
  setEditTownshipData,
  updateTownshipById,
} from "@/redux/features/Township";

const EditTownshipModal = ({ isCurrentTownship }) => {
  const [reassessmentNoticeDate, setReassessmentNoticeDate] = useState(null);
  const [lastFileDate, setLastFileDate] = useState(null);
  const [borAppealEnd, setBorAppealEnd] = useState(null);
  const [borAppealBegin, setBorAppealBegin] = useState(null);
  const [afterBorAppealEnd, setAfterBorAppealEnd] = useState(null);
  const [reassessment, setReassessment] = useState(null);
  const [currentReassessmentNoticeDate, setCurrentReassessmentNoticeDate] =
    useState(null);
  const [currentLastFileDate, setCurrentLastFileDate] = useState(null);
  const [currentBorAppealEnd, setCurrentBorAppealEnd] = useState(null);
  const [currentBorAppealBegin, setCurrentBorAppealBegin] = useState(null);
  const [currentAfterBorAppealEnd, setCurrentAfterBorAppealEnd] =
    useState(null);
  const [currentReassessment, setCurrentReassessment] = useState(null);

  const { toast } = useToast();
  const dispatch = useDispatch();
  const { editTownshipData } = useSelector((state) => state.townships);
  const [editTownship, { isLoading }] = useEditTownshipMutation();
  const [editCurrentTownship, { isLoading: isLoadingEditingCurrentTownship }] =
    useEditCurrentTownshipMutation();
  const { handleSubmit, setValue } = useForm({
    defaultValues: {
      name: editTownshipData.name,
      reassessment_notice_date: editTownshipData.reassessment_notice_date,
      current_reassessment_notice_date:
        editTownshipData.reassessment_notice_date,
      last_file_date: editTownshipData.last_file_date,
      current_last_file_date: editTownshipData.last_file_date,
      date_a_roll_certified: editTownshipData.date_a_roll_certified,
      current_date_a_roll_certified: editTownshipData.date_a_roll_certified,
      date_a_roll_published: editTownshipData.date_a_roll_published,
      current_date_a_roll_published: editTownshipData.date_a_roll_published,
      bor_appeal_begin: editTownshipData.bor_appeal_begin,
      current_bor_appeal_begin: editTownshipData.bor_appeal_begin,
      bor_appeal_end: editTownshipData.bor_appeal_end,
      current_bor_appeal_end: editTownshipData.bor_appeal_end,
      reassessment: editTownshipData.reassessment,
      current_reassessment: editTownshipData.reassessment,
      town: editTownshipData.town,
    },
  });

  const onSubmit = async (data) => {
    const newData = { ...editTownshipData, ...data };
    delete data.date_a_roll_certified;
    delete data.date_a_roll_published;

    const s = reassessment === "true" ? true : false;
    let res = null;
    if (isCurrentTownship) {
      delete data.reassessment;
      delete data.reassessment_notice_date;
      delete data.last_file_date;
      delete data.bor_appeal_begin;
      delete data.bor_appeal_end;
      delete data.after_bor_appeal_end;
      delete data.name;
      delete data.town;
      res = await editCurrentTownship({
        body: { ...data, current_reassessment: s },
        id: editTownshipData.id,
      });
    } else {
      delete data.current_reassessment;
      delete data.current_reassessment_notice_date;
      delete data.current_last_file_date;
      delete data.current_bor_appeal_begin;
      delete data.current_bor_appeal_end;
      delete data.current_date_a_roll_certified;
      delete data.current_date_a_roll_published;
      res = await editTownship({
        body: { ...data, reassessment: s },
        id: editTownshipData.id,
      });
    }
    if ("data" in res) {
      toast({
        title: "Success",
        description: "Township updated successfully",
        type: "success",
      });
      dispatch(setEditTownshipData(null));
      dispatch(updateTownshipById(newData));
    } else {
      toast({
        title: "Error",
        description: res.error.data.detail
          ? res.error.data.detail
          : "Something went wrong",
      });
    }
  };

  useEffect(() => {
    if (editTownshipData) {
      setReassessmentNoticeDate(editTownshipData.reassessment_notice_date);
      setLastFileDate(editTownshipData.last_file_date);
      setBorAppealEnd(editTownshipData.bor_appeal_end);
      setBorAppealBegin(editTownshipData.bor_appeal_begin);
      setAfterBorAppealEnd(editTownshipData.after_bor_appeal_end);
      setReassessment(editTownshipData.reassessment);
    }
  }, [editTownshipData]);

  return (
    <Dialog
      defaultOpen={editTownshipData}
      onOpenChange={() => dispatch(setEditTownshipData(null))}
    >
      <DialogContent className="sm:max-w-[500px] max-h-[calc(100vh-20%)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <div>
          <DialogHeader>
            <DialogTitle className="text-heading_1">Edit Township</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="w-full flex flex-col gap-2 flex-2">
              <label htmlFor="Disabled" className="text-body">
                Re-assessment
              </label>
              <Select
                onValueChange={(e) => {
                  setValue("reassessment", e);
                  setValue("current_reassessment", e);
                  setReassessment(e);
                }}
              >
                <SelectTrigger className="w-full h-[48px] rounded-[8px]">
                  <SelectValue placeholder={reassessment ? "True" : "False"} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectItem value="false">False</SelectItem>
                    <SelectItem value="true">True</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full flex flex-col gap-2 flex-2">
              <label htmlFor="User_Group" className="text-body ">
                Assessor Appeal Window
              </label>
              <div className="flex justify-between">
                <div className="w-[calc(50%-8px)]">
                  <p className="text-[#80838E]">Begin</p>
                  <div className="flex justify-between items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild className="w-full border">
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-[48px] rounded-[8px] justify-start text-left font-normal",
                            !reassessmentNoticeDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {reassessmentNoticeDate
                            ? format(reassessmentNoticeDate, "MM-dd-yyyy")
                            : ""}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar
                          mode="single"
                          selected={
                            isCurrentTownship
                              ? currentReassessmentNoticeDate
                              : reassessmentNoticeDate
                          }
                          onSelect={(e) => {
                            setValue(
                              "reassessment_notice_date",
                              format(e, "yyyy-MM-dd")
                            );
                            setValue(
                              "current_reassessment_notice_date",
                              format(e, "yyyy-MM-dd")
                            );
                            setReassessmentNoticeDate(e);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Trash2
                      className="cursor-pointer text-gray-400"
                      onClick={() => {
                        setValue("reassessment_notice_date", null);
                        setValue("current_reassessment_notice_date", null);
                        setReassessmentNoticeDate(null);
                        setCurrentReassessmentNoticeDate(null);
                      }}
                    />
                  </div>
                </div>
                <div className="w-[calc(50%-8px)]">
                  <p className="text-[#80838E]">End</p>
                  <div className="flex justify-between items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild className="w-full border">
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-[48px] rounded-[8px] justify-start text-left font-normal",
                            !lastFileDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {lastFileDate
                            ? format(lastFileDate, "MM-dd-yyyy")
                            : ""}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar
                          mode="single"
                          selected={lastFileDate}
                          onSelect={(e) => {
                            setValue("last_file_date", format(e, "yyyy-MM-dd"));
                            setValue(
                              "current_last_file_date",
                              format(e, "yyyy-MM-dd")
                            );
                            setLastFileDate(e);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <Trash2
                      className="cursor-pointer text-gray-400"
                      onClick={() => {
                        setValue("last_file_date", null);
                        setValue("current_last_file_date", null);
                        setLastFileDate(null);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2 flex-2">
              <label htmlFor="User_Group" className="text-body">
                Review Appeal Window
              </label>
              <div className="flex justify-between">
                <div className="w-[calc(50%-8px)]">
                  <p className="text-[#80838E]">Begin</p>
                  <div className="flex justify-between items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild className="w-full border">
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-[48px] rounded-[8px] justify-start text-left font-normal",
                            !borAppealBegin && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {borAppealBegin
                            ? format(borAppealBegin, "MM-dd-yyyy")
                            : ""}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar
                          mode="single"
                          selected={borAppealBegin}
                          onSelect={(e) => {
                            setValue(
                              "bor_appeal_begin",
                              format(e, "yyyy-MM-dd")
                            );
                            setValue(
                              "current_bor_appeal_begin",
                              format(e, "yyyy-MM-dd")
                            );
                            setBorAppealBegin(e);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Trash2
                      className="cursor-pointer text-gray-400"
                      onClick={() => {
                        setValue("bor_appeal_begin", null);
                        setValue("current_bor_appeal_begin", null);
                        setBorAppealBegin(null);
                      }}
                    />
                  </div>
                </div>
                <div className="w-[calc(50%-8px)]">
                  <p className="text-[#80838E]">End</p>
                  <div className="flex justify-between items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild className="w-full border">
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-[48px] rounded-[8px] justify-start text-left font-normal",
                            !borAppealEnd && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {borAppealEnd
                            ? format(borAppealEnd, "MM-dd-yyyy")
                            : ""}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar
                          mode="single"
                          selected={borAppealEnd}
                          onSelect={(e) => {
                            setValue("bor_appeal_end", format(e, "yyyy-MM-dd"));
                            setValue(
                              "current_bor_appeal_end",
                              format(e, "yyyy-MM-dd")
                            );
                            setBorAppealEnd(e);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Trash2
                      className="cursor-pointer text-gray-400"
                      onClick={() => {
                        setValue("bor_appeal_end", null);
                        setValue("current_bor_appeal_end", null);
                        setBorAppealEnd(null);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2 flex-2">
              <label htmlFor="User_Group" className="text-body">
                State Appeal Board
              </label>
              <div className="flex justify-between items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild className="w-full border">
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full h-[48px] rounded-[8px] justify-start text-left font-normal",
                        !afterBorAppealEnd && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {afterBorAppealEnd
                        ? format(afterBorAppealEnd, "MM-dd-yyyy")
                        : ""}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={afterBorAppealEnd}
                      onSelect={(e) => {
                        setValue(
                          "after_bor_appeal_end",
                          format(e, "yyyy-MM-dd")
                        );
                        setValue(
                          "current_after_bor_appeal_end",
                          format(e, "yyyy-MM-dd")
                        );
                        setAfterBorAppealEnd(e);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <Trash2
                  className="cursor-pointer text-gray-400"
                  onClick={() => {
                    setValue("after_bor_appeal_end", null);
                    setValue("current_after_bor_appeal_end", null);
                    setAfterBorAppealEnd(null);
                  }}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="!justify-start gap-2">
            <Button
              type="submit"
              className="bg-primary w-full rounded-[8px] text-white flex gap-1"
              onClick={handleSubmit(onSubmit)}
            >
              {isLoading && <Loader className="w-max" />}
              <span>Save</span>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTownshipModal;
