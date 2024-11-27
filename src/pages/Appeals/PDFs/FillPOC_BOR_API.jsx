import { Download } from "lucide-react";
import POA_BOR from "../../../assets/PDFs/POA_BOR.pdf";
import { PDFDocument } from "pdf-lib";
import PropTypes from "prop-types";
import { formatePin } from "@/utiles/formatePin";
import { setFieldPDF } from "@/utiles/setFieldPDF";

const FillPOC_BOR_API = ({ hasData, data }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();

  const fillForm = async () => {
    // Step 1: Load the PDF form.
    const formUrl = POA_BOR;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    // Step 2: Retrieve the form fields.
    const form = pdfDoc.getForm();
    form.getTextField("PINs 1").setFontSize(10);
    form.getTextField("PINs 2").setFontSize(10);
    form.getTextField("PINs 3").setFontSize(10);
    setFieldPDF(form, "PINs 1", `${formatePin(data?.pin1)}`);
    setFieldPDF(
      form,
      "PINs 2",
      `${data.pin2 ? `${formatePin(data.pin2)}` : ""}`
    );
    setFieldPDF(
      form,
      "PINs 3",
      `${data.pin3 ? `${formatePin(data.pin3)}` : ""}`
    );
    setFieldPDF(form, "undefined", data?.property_zipcode);
    setFieldPDF(form, "City", data?.property_city);
    setFieldPDF(form, "ZIP Code", data?.property_state);
    setFieldPDF(form, "State", data?.property_address);
    setFieldPDF(form, "Township", data.property_township);
    setFieldPDF(
      form,
      "For assessment year 20 1",
      "Hani Khatib / Khatib Law, LLC"
    );
    setFieldPDF(form, "PrintNameofaffiant", `${data?.client_name}`);
    setFieldPDF(
      form,
      "Date",
      `${currentMonth + 1}/${currentDay}/${currentYear}`
    );
    setFieldPDF(
      form,
      "Date_2",
      `${currentMonth + 1}/${currentDay}/${currentYear}`
    );
    setFieldPDF(form, "BOR Atty Code", "11352");
    // Step 4: Save the modified PDF.
    const pdfBytes = await pdfDoc.save();

    // Step 5: Create a `Blob` from the PDF bytes,
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    // Step 6: Create a download URL for the `Blob`.
    const url = URL.createObjectURL(blob);

    // Step 7: Create a link element and simulate a click event to trigger the download.
    const link = document.createElement("a");
    link.href = url;
    link.download = `POC_BOR_Client_${data?.client_name}_.pdf`;
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
        Export POA BOR
      </p>
    </div>
  );
};

FillPOC_BOR_API.propTypes = {
  data: PropTypes.object.isRequired,
  hasData: PropTypes.bool.isRequired,
};

export default FillPOC_BOR_API;
