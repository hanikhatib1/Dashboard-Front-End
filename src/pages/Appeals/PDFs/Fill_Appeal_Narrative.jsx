import { useGetTownshipNameMutation } from "@/redux/apiSlice";
import { Download } from "lucide-react";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import Appeal_Narrative from "../../../assets/PDFs/Appeal_Narrative_2.pdf";
import { PDFDocument } from "pdf-lib";
import { setFieldPDF } from "@/utiles/setFieldPDF";
import { formatePin } from "@/utiles/formatePin";
import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";

const Fill_Appeal_Narrative = ({
  property,
  client,
  pin2,
  pin3,
  appeal_number,
}) => {
  const [townShip, setTownShip] = useState("");
  const hasProperty = Boolean(property);
  const hasClient = Boolean(client);
  const hasData = hasProperty && hasClient;
  const [getTownshipName, { isLoading }] = useGetTownshipNameMutation({});

  const fillForm = async () => {
    // Step 1: Load the PDF form.
    const formUrl = Appeal_Narrative;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    // Step 2: Retrieve the form fields.
    const form = pdfDoc.getForm();
    const fildes = form.getFields();
    const currentYear = new Date().getFullYear();

    setFieldPDF(form, "Appeal Number", appeal_number);

    setFieldPDF(form, "Appeal Year", currentYear.toString());
    setFieldPDF(form, "Property Index Numbers", formatePin(property?.pin));
    setFieldPDF(form, "Property Index Numbers_3", formatePin(property?.pin));
    setFieldPDF(form, "Property Street Address", property?.address);
    setFieldPDF(form, "City", property?.city);
    setFieldPDF(form, "Zip", property?.zip_code);
    setFieldPDF(form, "Township", townShip);
    setFieldPDF(
      form,
      "Owner I Taxpayer",
      `${client?.first_name} ${client?.last_name}`
    );
    setFieldPDF(form, "Owners Mailing Address", client?.address);
    setFieldPDF(form, "City_2", client?.city);
    setFieldPDF(form, "Zip_2", client?.zip_code);
    setFieldPDF(
      form,
      "Daytime Phone Number",
      client?.phone ? formatPhoneNumber(client?.phone) : ""
    );
    setFieldPDF(form, "Email Address", client?.email);
    setFieldPDF(
      form,
      "Property Index Numbers_2",
      `${pin2 ? formatePin(pin2) : ""}  ${pin3 && pin2 ? `,` : ""} ${pin3 ? formatePin(pin3) : ""}`
    );

    /* for (let i = 0; i < fildes.length; i++) {
      console.log("fildes", fildes[i].getName());
      setFieldPDF(form, fildes[i].getName(), `${fildes[i].getName()}`);
    } */

    const pdfBytes = await pdfDoc.save();

    // Step 5: Create a `Blob` from the PDF bytes,
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    // Step 6: Create a download URL for the `Blob`.
    const url = URL.createObjectURL(blob);

    // Step 7: Create a link element and simulate a click event to trigger the download.
    const link = document.createElement("a");
    link.href = url;
    link.download = `Residential_Appeal_Narrative_Client_${client?.first_name}_${client?.last_name}.pdf`;
    link.click();
  };

  const handleGetTownshipName = useCallback(async () => {
    const res = await getTownshipName(property?.pin);
    if ("data" in res) setTownShip(res.data.name);
    else setTownShip("");
  }, [getTownshipName, property?.pin]);

  useEffect(() => {
    if (property) handleGetTownshipName();
  }, [handleGetTownshipName, property]);

  return (
    <div
      onClick={hasData && !isLoading ? fillForm : undefined}
      className={`flex gap-2 !p-1 !bg-white !text-black items-center ${hasData && !isLoading ? "cursor-pointer hover:border-gray-400 rounded-[8px] overflow-hidden" : ""} border border-white `}
    >
      <Download color="#80838E" />
      <p
        className={`text-[16px] font-medium ${hasData && !isLoading ? "" : "text-[#80838E]"}`}
      >
        Export Residential Appeal Narrative
      </p>
    </div>
  );
};

Fill_Appeal_Narrative.propTypes = {
  property: PropTypes.object,
  client: PropTypes.object,
  pin2: PropTypes.string,
  pin3: PropTypes.string,
};

export default Fill_Appeal_Narrative;
