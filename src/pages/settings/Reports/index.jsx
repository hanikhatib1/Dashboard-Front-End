import React from "react";
import ReportCard from "./ReportCard";
import { useGetReportsQuery } from "@/redux/apiSlice";
import Loader from "@/components/Loader";
import DeleteReportModel from "./DeleteReportModel";
import EditReport from "./EditReport";

const Reports = () => {
  const { data, isLoading, refetch } = useGetReportsQuery();
  const [deletedReport, setDeletedReport] = React.useState(null);
  const [editReport, setEditReport] = React.useState(null);

  if (isLoading) return <Loader />;
  console.log("data", data);
  return (
    <div className="p-8 flex gap-4 flex-wrap relative">
      {data &&
        data.data.map((reportData, index) => (
          <ReportCard
            key={index}
            report={reportData}
            setDeletedReport={setDeletedReport}
            setEditReport={setEditReport}
          />
        ))}

      {deletedReport && (
        <DeleteReportModel
          deletedReport={deletedReport}
          setDeletedReport={setDeletedReport}
          refetch={refetch}
        />
      )}
      {editReport && (
        <EditReport
          refetch={refetch}
          editReportData={editReport}
          setEditReport={setEditReport}
        />
      )}
    </div>
  );
};

export default Reports;
