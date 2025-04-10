import { Download, Eye, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FillPOC_CCA_API from "../PDFs/FillPOC_CCA_API";
import { useExportAppealDataMutation } from "@/redux/apiSlice";
import FillPOC_BOR_API from "../PDFs/FillPOC_BOR_API";
import Fill_SA_API from "../PDFs/Fill_SA_API";
import Fill_Sales_Questions_API from "../PDFs/Fill_Sales_Questions_API";
import Fill_Appeal_Narrative_API from "../PDFs/Fill_Appeal_Narrative_API";

const documents = [
  {
    key: "ccoa",
    title: "POA CCA",
    download: (props) => (
      <FillPOC_CCA_API hasData={props} data={props ? props : false} iconOnly />
    ),
    upload: (props) => <div></div>,
    view: (appealData) => (
      <Link target="_blank" to={appealData?.ccoa.link}>
        <Eye />
      </Link>
    ),
  },
  {
    key: "bor",
    title: "POA BOR",
    download: (props) => (
      <FillPOC_BOR_API hasData={props} data={props ? props : false} iconOnly />
    ),
    upload: (props) => <div></div>,
    view: (appealData) => (
      <Link target="_blank" to={appealData?.bor.link}>
        <Eye />
      </Link>
    ),
  },
  /* {
    key: "lour",
    title: "Report",
    download: (props) => (
      <FillPOC_CCA_API hasData={props} data={props ? props : false} iconOnly />
    ),
    upload: (props) => <div></div>,
    view: (appealData) => (
      <Link target="_blank" to={appealData?.lour.link}>
        <Eye />
      </Link>
    ),
  }, */
  {
    key: "sa",
    title: "Representation Agreement",
    download: (props) => (
      <Fill_SA_API hasData={props} data={props ? props : false} iconOnly />
    ),
    upload: (props) => <div></div>,
    view: (appealData) => (
      <Link target="_blank" to={appealData?.sa.link}>
        <Eye />
      </Link>
    ),
  },
  {
    key: "ran",
    title: "RAN",
    download: (props) => (
      <Fill_Appeal_Narrative_API
        hasData={props}
        data={props ? props : false}
        iconOnly
      />
    ),
    upload: (props) => <div></div>,
    view: (appealData) => (
      <Link target="_blank" to={appealData?.ran.link}>
        <Eye />
      </Link>
    ),
  },
  {
    key: "sq",
    title: "Sales Questionnaire",
    download: (props) => (
      <Fill_Sales_Questions_API
        hasData={props}
        data={props ? props : false}
        iconOnly
      />
    ),
    upload: (props) => <div></div>,
    view: (appealData) => (
      <Link target="_blank" to={appealData?.sq.link}>
        <Eye />
      </Link>
    ),
  },
];

const Files = ({ appealData }) => {
  const [exportAppealData, { data }] = useExportAppealDataMutation();
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (!appealData.client_email && !appealData.pin1) return;
    async function fetchData() {
      const res = await exportAppealData({
        client_email: appealData.client_email,
        pin1: appealData.pin1,
        pin2: appealData.pin2,
        pin3: appealData.pin3,
      });
      if ("data" in res) setHasData(true);
    }
    fetchData();
  }, [appealData.client_email, appealData.pin1]);

  return (
    <>
      {documents.map(
        (file) =>
          appealData[file.key] && (
            <div
              key={file.key}
              className="w-[calc(50%-16px)] flex justify-between items-center"
            >
              <p className="text-[16px] text-black text-opacity-50 font-[400]">
                {file.title}
              </p>
              <div className="flex gap-2 text-[#1A73E8] items-center">
                {/* <Upload className="cursor-pointer" />
                <Download className="cursor-pointer" /> */}
                {file.download(appealData)}
                {file.view(appealData)}
              </div>
            </div>
          )
      )}
      {appealData["lour"] && (
        <div className="w-[calc(50%-16px)] flex justify-between items-center">
          <p className="text-[16px] text-black text-opacity-50 font-[400]">
            Report
          </p>
          <div className="flex gap-2 text-[#1A73E8] items-center">
            <Link target="_blank" to={appealData?.lour.link}>
              <Eye />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Files;
