import { Download } from "lucide-react";
import POA_CCA from "../../../assets/PDFs/POA_CCA.pdf";
import { PDFDocument } from "pdf-lib";
import { formatePin } from "@/utiles/formatePin";
import { setFieldPDF } from "@/utiles/setFieldPDF";
import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";
import PropTypes from "prop-types";

const FillPOC_CCA_API = ({ data, hasData, iconOnly }) => {
  const fillForm = async () => {
    // Step 1: Load the PDF form.
    const formUrl = POA_CCA;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    // Step 2: Retrieve the form fields.
    const form = pdfDoc.getForm();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();

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
      "whose name appears on the appeal form to represent me before the Assessor relative to the",
      "Hani Khatib"
    );
    setFieldPDF(form, "Print Name", `${data?.client_name}`);
    setFieldPDF(
      form,
      "Date",
      `${currentMonth + 1}/${currentDay}/${currentYear}`
    );
    setFieldPDF(
      form,
      "Daytime Phone Number_2",
      data?.client_phone ? formatPhoneNumber(data?.client_phone) : ""
    );
    setFieldPDF(form, "Firm Name", "Khatib Law, LLC");
    setFieldPDF(form, "Street Address", "6600 W. College Drive, Suite 207");
    setFieldPDF(form, "City_3", "Palos Heights");
    setFieldPDF(form, "Zip_3", "60463");
    setFieldPDF(form, "Daytime Phone Number_3", "708-722-2222");
    setFieldPDF(form, "Atty I Rep Code", "11352");
    setFieldPDF(form, "Print Name_2", "Hani Khatib");
    setFieldPDF(
      form,
      "being first duly sworn on oath state",
      `${data?.client_name}`
    );
    setFieldPDF(
      form,
      "Property Index Numbers_2",
      `${data.pin2 ? formatePin(data.pin2) : ""}  ${data.pin3 && data.pin2 ? `,` : ""} ${data.pin3 ? formatePin(data.pin3) : ""}`
    );

    const townShip_filed = form.getTextField("Text2");
    townShip_filed.setFontSize(8);
    townShip_filed.setText(data?.property_township);
    setFieldPDF(form, "Text3", data.property_state);
    setFieldPDF(form, "Text6", `${currentYear}`);
    setFieldPDF(form, "Text7", "IL");
    // Step 4: Save the modified PDF.
    const pdfBytes = await pdfDoc.save();

    // Step 5: Create a `Blob` from the PDF bytes,
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    // Step 6: Create a download URL for the `Blob`.
    const url = URL.createObjectURL(blob);

    // Step 7: Create a link element and simulate a click event to trigger the download.
    const link = document.createElement("a");
    link.href = url;
    link.download = `POC_CCA_Client_${data?.client_name}_.pdf`;
    link.click();
  };

  return (
    <div
      onClick={fillForm}
      className={`flex gap-2 !p-1 !bg-white !text-black items-center ${hasData ? "cursor-pointer hover:border-gray-400 rounded-[8px] overflow-hidden" : ""} border border-white `}
    >
      <Download color="#80838E" />
      {!iconOnly && (
        <p
          className={`text-[16px] font-medium ${hasData ? "" : "text-[#80838E]"}`}
        >
          Export POA CCA
        </p>
      )}
    </div>
  );
};

FillPOC_CCA_API.propTypes = {
  data: PropTypes.object.isRequired,
  hasData: PropTypes.bool.isRequired,
};

export default FillPOC_CCA_API;
