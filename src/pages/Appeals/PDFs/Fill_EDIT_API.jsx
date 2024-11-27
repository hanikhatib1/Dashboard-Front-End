import { useEffect, useState } from "react";
import FillPOC_CCA_API from "./FillPOC_CCA_API";
import { useExportAppealDataMutation } from "@/redux/apiSlice";
import PropTypes from "prop-types";
import FillPOC_BOR_API from "./FillPOC_BOR_API";
import Fill_SA_API from "./Fill_SA_API";
import Fill_Appeal_Narrative_API from "./Fill_Appeal_Narrative_API";
import Fill_Sales_Questions_API from "./Fill_Sales_Questions_API";

const Fill_EDIT_API = ({ client_email, pin1, pin2, pin3 }) => {
  const [exportAppealData, { data }] = useExportAppealDataMutation();
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (!client_email && !pin1) return;
    async function fetchData() {
      const res = await exportAppealData({
        client_email,
        pin1,
        pin2,
        pin3,
      });
      if ("data" in res) setHasData(true);
    }
    fetchData();
  }, [client_email, pin1]);

  return (
    <div className="flex flex-wrap [&>div]:w-full  md:[&>div]:w-[calc(50%-16px)] gap-6">
      <FillPOC_CCA_API hasData={hasData} data={data ? data.data : false} />
      <FillPOC_BOR_API hasData={hasData} data={data ? data.data : false} />
      <Fill_SA_API hasData={hasData} data={data ? data.data : false} />
      <Fill_Appeal_Narrative_API
        hasData={hasData}
        data={data ? data.data : false}
      />
      <Fill_Sales_Questions_API
        hasData={hasData}
        data={data ? data.data : false}
      />
    </div>
  );
};

Fill_EDIT_API.propTypes = {
  client_email: PropTypes.string,
  pin1: PropTypes.string,
  pin2: PropTypes.string,
  pin3: PropTypes.string,
};

export default Fill_EDIT_API;
