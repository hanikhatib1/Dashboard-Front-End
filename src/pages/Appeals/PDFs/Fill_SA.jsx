import { Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import Representation_Agreement_2 from "../../../assets/PDFs/Representation_Agreement2.pdf";

import PropTypes from "prop-types";
import { setFieldPDF } from "@/utiles/setFieldPDF";
import { formatePin } from "@/utiles/formatePin";

const Fill_SA = ({ property, client, pin3, pin2, appeal_number }) => {
  const hasProperty = Boolean(property);
  const hasClient = Boolean(client);
  const hasData = hasProperty && hasClient && appeal_number;
  const fillForm = async () => {
    // Step 1: Load the PDF form.
    const formUrl = Representation_Agreement_2;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    // Step 2: Retrieve the form fields.
    const form = pdfDoc.getForm();
    const fildes = form.getFields();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    for (let i = 0; i < fildes.length; i++) {
      const field = fildes[i];
      console.log("Field Name:", field.getName());
      // You can also log other properties of the field if needed
    }

    setFieldPDF(
      form,
      "Date_RA",
      `${currentMonth + 1}/${currentDay}/${currentYear}`
    );
    setFieldPDF(form, "Client_RA", `${client?.first_name} ${client?.last_name}`);
    setFieldPDF(form, "Property Address_RA", `${property?.address}`);
    setFieldPDF(
      form,
      "PINs_RA",
      `${formatePin(property?.pin)} ${pin2 ? `,${formatePin(pin2)}` : ""} ${pin3 ? `,${formatePin(pin3)}` : ""}`
    );
    setFieldPDF(
      form,
      "Mailing Address_RA",
      `${client?.address}, ${client?.city}, ${client?.state}, ${client?.zip_code}`
    );

    for (let i = 0; i < fildes.length; i++) {
      console.log("fildes", fildes[i].getName());
    }
    // Step 4: Save the modified PDF.
    const pdfBytes = await pdfDoc.save();

    // Step 5: Create a `Blob` from the PDF bytes,
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    // Step 6: Create a download URL for the `Blob`.
    const url = URL.createObjectURL(blob);

    // Step 7: Create a link element and simulate a click event to trigger the download.
    const link = document.createElement("a");
    link.href = url;
    link.download = `Representation_Agreement_Client_${client?.first_name}_${client?.last_name}.pdf`;
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
        Export Representation Agreement
      </p>
    </div>
  );
};

Fill_SA.propTypes = {
  property: PropTypes.object,
  client: PropTypes.object,
  pin2: PropTypes.string,
  pin3: PropTypes.string,
};

export default Fill_SA;
