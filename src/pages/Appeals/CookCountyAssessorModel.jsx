import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setCookCountyAssessorPDF } from "@/redux/features/AppealSlice";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AppealPDF2 from "@/AppealPDF2";
import { Download } from "lucide-react";
import React from "react";

const CookCountyAssessorModel = ({ data }) => {
  const { cookCountyAssessorPDF } = useSelector((state) => state.appeals);
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    numberOfComparison: "",
    attorneyCode: "",
    boardOfReviewNumber: "",
  });

  return (
    <Dialog
      defaultOpen={cookCountyAssessorPDF}
      open={open}
      onOpenChange={(e) => {
        dispatch(setCookCountyAssessorPDF(null));
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[calc(100vh-20%)]  bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <DialogHeader>
          <DialogTitle className="text-heading_1">
            Cook County Assessor PDF
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 items-center justify-center w-full">
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="Number">Number of comparison:</label>
              <input
                type="text"
                className="rounded-[8px] h-[32px] p-3"
                value={state.numberOfComparison}
                onChange={(e) =>
                  setState({ ...state, numberOfComparison: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="Number">Attorney Code:</label>
              <input
                type="text"
                className="rounded-[8px] h-[32px] p-3"
                value={state.attorneyCode}
                onChange={(e) =>
                  setState({ ...state, attorneyCode: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="Number">Board of Review Number:</label>
              <input
                type="text"
                className="rounded-[8px] h-[32px] p-3"
                value={state.boardOfReviewNumber}
                onChange={(e) =>
                  setState({ ...state, boardOfReviewNumber: e.target.value })
                }
              />
            </div>
          </div>
          <PDFDownloadLink
            document={
              <AppealPDF2
                editAppealData={data ? data.data : false}
                stateNumber={state}
              />
            }
            fileName="CookCounty_Appeal.pdf"
            className="w-full"
          >
            {/* {({ loading }) => (loading ? "Loading PDF..." : "Export POA BOR")} */}
            <div
              className={`flex gap-2 !p-1 !bg-white !text-black items-center ${data.data ? "cursor-pointer hover:border-gray-400 rounded-[8px] overflow-hidden" : ""} border border-white `}
            >
              <Download color="#80838E" />{" "}
              <p
                className={`text-[16px] font-medium ${data.data ? "" : "text-[#80838E]"}`}
              >
                Cook County Assessor
              </p>
            </div>
          </PDFDownloadLink>
        </div>

        <DialogFooter className="!justify-start gap-2">
          <Button
            className="bg-primary rounded-[8px] w-[250px] text-white"
            onClick={() => dispatch(setCookCountyAssessorPDF(null))}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CookCountyAssessorModel;
