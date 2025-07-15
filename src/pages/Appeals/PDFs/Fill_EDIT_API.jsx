import { useEffect, useState } from "react";
import FillPOC_CCA_API from "./FillPOC_CCA_API";
import { useExportAppealDataMutation } from "@/redux/apiSlice";
import PropTypes from "prop-types";
import FillPOC_BOR_API from "./FillPOC_BOR_API";
import Fill_SA_API from "./Fill_SA_API";
import Fill_Appeal_Narrative_API from "./Fill_Appeal_Narrative_API";
import Fill_Sales_Questions_API from "./Fill_Sales_Questions_API";
import Fill_All_PDFs_API from "./Fill_All_PDFs_API";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AppealPDF from "@/AppealPDF";
import { Download } from "lucide-react";
import AppealPDF2 from "@/AppealPDF2";
import CookCountyAssessorModel from "../CookCountyAssessorModel";
import { setCookCountyAssessorPDF } from "@/redux/features/AppealSlice";
import { useDispatch, useSelector } from "react-redux";

const Fill_EDIT_API = ({
  client_email,
  pin1,
  pin2,
  pin3,
  appeal_number,
  appeal_id,
}) => {
  const [exportAppealData, { data }] = useExportAppealDataMutation();
  const [hasData, setHasData] = useState(false);
  const dispatch = useDispatch();
  const { cookCountyAssessorPDF } = useSelector((state) => state.appeals);

  useEffect(() => {
    if (!client_email && !pin1) return;
    async function fetchData() {
      const res = await exportAppealData({
        client_email,
        pin1,
        pin2,
        pin3,
        appeal_id,
      });
      if ("data" in res) setHasData(true);
    }
    fetchData();
  }, [client_email, pin1]);

  return (
    <div className="flex flex-wrap [&>div]:w-full  md:[&>div]:w-[calc(50%-16px)] gap-6">
      <FillPOC_CCA_API
        hasData={hasData && appeal_number}
        data={data ? data.data : false}
      />
      <FillPOC_BOR_API
        hasData={hasData && appeal_number}
        data={data ? data.data : false}
      />
      <Fill_SA_API
        hasData={hasData && appeal_number}
        data={data ? data.data : false}
      />
      <Fill_Appeal_Narrative_API
        hasData={hasData && appeal_number}
        data={data ? data.data : false}
      />
      <Fill_Sales_Questions_API
        hasData={hasData && appeal_number}
        data={data ? data.data : false}
      />
      <Fill_All_PDFs_API
        hasData={hasData && appeal_number}
        data={data ? data.data : false}
      />
      {data && (
        <PDFDownloadLink
          document={<AppealPDF editAppealData={data ? data.data : false} />}
          fileName="CookCounty_Appeal.pdf"
        >
          <div
            className={`flex gap-2 !p-1 !bg-white !text-black items-center ${data.data ? "cursor-pointer hover:border-gray-400 rounded-[8px] overflow-hidden" : ""} border border-white `}
          >
            <Download color="#80838E" />{" "}
            <p
              className={`text-[16px] font-medium ${data.data ? "" : "text-[#80838E]"}`}
            >
              Cook County Board of Review
            </p>
          </div>
        </PDFDownloadLink>
      )}
      {/*  dispatch(setCookCountyAssessorPDF(null)) */}
      {data && (
        <div
          onClick={() => dispatch(setCookCountyAssessorPDF(true))}
          className={`flex gap-2 !p-1 !bg-white !text-black items-center ${data.data ? "cursor-pointer hover:border-gray-400 rounded-[8px] overflow-hidden" : ""} border border-white `}
        >
          <Download color="#80838E" />{" "}
          <p
            className={`text-[16px] font-medium ${data.data ? "" : "text-[#80838E]"}`}
          >
            Cook County Assessor
          </p>
        </div>
      )}
      {cookCountyAssessorPDF && <CookCountyAssessorModel data={data} />}
    </div>
  );
};

Fill_EDIT_API.propTypes = {
  client_email: PropTypes.string,
  pin1: PropTypes.string,
  pin2: PropTypes.string,
  pin3: PropTypes.string,
  appeal_number: PropTypes.string,
  appeal_id: PropTypes.string,
};

export default Fill_EDIT_API;
