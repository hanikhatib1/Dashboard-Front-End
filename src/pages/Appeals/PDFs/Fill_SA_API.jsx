import { Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import Representation_Agreement from "../../../assets/PDFs/Representation_Agreement.pdf";
import PropTypes from "prop-types";
import { setFieldPDF } from "@/utiles/setFieldPDF";
import { formatePin } from "@/utiles/formatePin";
import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";

const Fill_SA_API = ({ data, hasData, iconOnly }) => {
  const fillForm = async () => {
    // Step 1: Load the PDF form.
    const formUrl = Representation_Agreement;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    // Step 2: Retrieve the form fields.
    const form = pdfDoc.getForm();
    const fildes = form.getFields();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    for (let i = 0; i < fildes.length; i++) {
      console.log("fildes", fildes[i].getName());
    }
    setFieldPDF(
      form,
      "Date",
      `${currentMonth + 1}/${currentDay}/${currentYear}`
    );
    setFieldPDF(form, "Client", ` ${data?.client_name}`);
    setFieldPDF(form, "Property Address", `${data?.client_address}`);
    setFieldPDF(
      form,
      "PINs",
      `${formatePin(data?.pin1)} ${data?.pin2 ? `,${formatePin(data?.pin2)}` : ""} ${data?.pin3 ? `,${formatePin(data?.pin3)}` : ""}`
    );
    setFieldPDF(
      form,
      "Mailing Address",
      `${formatPhoneNumber(data?.property_address)}`
    );

    // Step 4: Save the modified PDF.
    const pdfBytes = await pdfDoc.save();

    // Step 5: Create a `Blob` from the PDF bytes,
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    // Step 6: Create a download URL for the `Blob`.
    const url = URL.createObjectURL(blob);

    // Step 7: Create a link element and simulate a click event to trigger the download.
    const link = document.createElement("a");
    link.href = url;
    link.download = `Representation_Agreement_Client_${data?.client_name}.pdf`;
    link.click();
  };

  return (
    <div
      onClick={hasData ? fillForm : undefined}
      className={`flex gap-2 !p-1 !bg-white !text-black items-center ${hasData ? "cursor-pointer hover:border-gray-400 rounded-[8px] overflow-hidden" : ""} border border-white `}
    >
      <Download color="#80838E" />
      {!iconOnly && (
        <p
          className={`text-[16px] font-medium ${hasData ? "" : "text-[#80838E]"}`}
        >
          Export Representation Agreement
        </p>
      )}
    </div>
  );
};

Fill_SA_API.propTypes = {
  data: PropTypes.object,
  hasData: PropTypes.bool,
};

export default Fill_SA_API;
