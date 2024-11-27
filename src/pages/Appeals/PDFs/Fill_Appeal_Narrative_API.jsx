import { setFieldPDF } from "@/utiles/setFieldPDF";
import { Download } from "lucide-react";
import PropTypes from "prop-types";
import Appeal_Narrative from "../../../assets/PDFs/Appeal_Narrative_2.pdf";
import { PDFDocument } from "pdf-lib";
import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";
import { formatePin } from "@/utiles/formatePin";

const Fill_Appeal_Narrative_API = ({ data, hasData }) => {
  const fillForm = async () => {
    // Step 1: Load the PDF form.
    const formUrl = Appeal_Narrative;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    // Step 2: Retrieve the form fields.
    const form = pdfDoc.getForm();
    const fildes = form.getFields();
    const currentYear = new Date().getFullYear();

    setFieldPDF(form, "Appeal Year", currentYear.toString());
    setFieldPDF(form, "Property Index Numbers", formatePin(data?.pin1));
    setFieldPDF(form, "Property Street Address", data?.property_address);
    setFieldPDF(form, "City", data?.property_city);
    setFieldPDF(form, "Zip", data?.property_zipcode);
    setFieldPDF(form, "Township", data.property_township);
    setFieldPDF(form, "Owner I Taxpayer", `${data?.client_name}`);
    setFieldPDF(form, "Owners Mailing Address", data?.client_address);
    setFieldPDF(form, "City_2", data?.client_city);
    setFieldPDF(form, "Zip_2", data?.client_zipcode);
    setFieldPDF(
      form,
      "Daytime Phone Number",
      data?.client_phone ? formatPhoneNumber(data?.client_phone) : ""
    );
    setFieldPDF(form, "Email Address", data?.client_email);
    setFieldPDF(
      form,
      "Property Index Numbers_2",
      `${data.pin2 ? formatePin(data.pin2) : ""}  ${data.pin3 && data.pin2 ? `,` : ""} ${data.pin3 ? formatePin(data.pin3) : ""}`
    );

    for (let i = 0; i < fildes.length; i++) {
      console.log("fildes", fildes[i].getName());
    }

    const pdfBytes = await pdfDoc.save();

    // Step 5: Create a `Blob` from the PDF bytes,
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    // Step 6: Create a download URL for the `Blob`.
    const url = URL.createObjectURL(blob);

    // Step 7: Create a link element and simulate a click event to trigger the download.
    const link = document.createElement("a");
    link.href = url;
    link.download = `Residential_Appeal_Narrative_Client_${data?.client_name}.pdf`;
    link.click();
  };
  return (
    <div
      onClick={hasData ? fillForm : undefined}
      className={`flex gap-2 !p-1 !bg-white !text-black items-center ${hasData ? "cursor-pointer hover:border-gray-400 rounded-[8px] overflow-hidden" : ""} border border-white `}
    >
      <Download color="#80838E" />
      <p
        className={`text-[16px] font-medium ${hasData ? "" : "text-[#80838E]"}`}
      >
        Export Residential Appeal Narrative
      </p>
    </div>
  );
};

Fill_Appeal_Narrative_API.propTypes = {
  data: PropTypes.object,
  hasData: PropTypes.bool,
};

export default Fill_Appeal_Narrative_API;
