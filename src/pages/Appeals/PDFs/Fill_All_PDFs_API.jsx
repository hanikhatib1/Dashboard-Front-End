import { Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import POA_CCA from "../../../assets/PDFs/POA_CCA.pdf";
import POA_BOR from "../../../assets/PDFs/POA_BOR.pdf";
import Representation_Agreement from "../../../assets/PDFs/Representation_Agreement.pdf";
import Appeal_Narrative from "../../../assets/PDFs/Appeal_Narrative_2.pdf";
import Sales_Questions from "../../../assets/PDFs/salesquest.pdf";
import { setFieldPDF } from "@/utiles/setFieldPDF";
import { formatePin } from "@/utiles/formatePin";
import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";

const Fill_All_PDFs_API = ({ data, hasData }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();

  const fillPOC_CCA = async () => {
    // Step 1: Load the PDF form.
    const formUrl = POA_CCA;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    // Step 2: Retrieve the form fields.
    const form = pdfDoc.getForm();

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

    await pdfDoc.save();
    return pdfDoc;
  };
  const fillPOA_BOR = async () => {
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
    await pdfDoc.save();
    return pdfDoc;
  };
  const fillRepresentation_Agreement = async () => {
    // Step 1: Load the PDF form.
    const formUrl = Representation_Agreement;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    // Step 2: Retrieve the form fields.
    const form = pdfDoc.getForm();

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
    await pdfDoc.save();
    return pdfDoc;
  };

  const fillAppeal_Narrative = async () => {
    // Step 1: Load the PDF form.
    const formUrl = Appeal_Narrative;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    // Step 2: Retrieve the form fields.
    const form = pdfDoc.getForm();

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

    await pdfDoc.save();
    return pdfDoc;
  };
  const fillSales_Questions = async () => {
    // Step 1: Load the PDF form.
    const formUrl = Sales_Questions;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    // Step 2: Retrieve the form fields.
    const form = pdfDoc.getForm();

    setFieldPDF(form, "WWWCOOKCOUNTYASSESSORCOM 2", currentYear.toString());
    setFieldPDF(form, "Property Index Numbers", `${formatePin(data?.pin1)}`);
    setFieldPDF(
      form,
      "Property Index Numbers_2",
      `${data.pin2 ? formatePin(data.pin2) : ""}  ${data.pin3 && data.pin2 ? `,` : ""} ${data.pin3 ? formatePin(data.pin3) : ""}`
    );

    setFieldPDF(form, "Zip", data?.property_zipcode);
    setFieldPDF(form, "City", data?.property_city);
    setFieldPDF(form, "Property Street Address", data?.property_address);
    setFieldPDF(form, "WWWCOOKCOUNTYASSESSORCOM 1", data.property_township);

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
      "Date",
      `${currentMonth + 1}/${currentDay}/${currentYear}`
    );

    // Step 4: Save the modified PDF.
    await pdfDoc.save();
    return pdfDoc;
  };

  const fillForm = async () => {
    const mergedPdf = await PDFDocument.create();

    const p1 = await fillPOC_CCA();

    let pages = await mergedPdf.copyPages(p1, p1.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));

    const b2 = await fillPOA_BOR();

    pages = await mergedPdf.copyPages(b2, b2.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));

    const b3 = await fillRepresentation_Agreement();

    pages = await mergedPdf.copyPages(b3, b3.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));

    const b4 = await fillAppeal_Narrative();

    pages = await mergedPdf.copyPages(b4, b4.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));

    const b5 = await fillSales_Questions();
    pages = await mergedPdf.copyPages(b5, b5.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "merged.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onClick={() => fillForm()}
      className={`flex gap-2 !p-1 !bg-white !text-black items-center ${hasData ? "cursor-pointer hover:border-gray-400 rounded-[8px] overflow-hidden" : ""} border border-white `}
    >
      <Download color="#80838E" />
      <p
        className={`text-[16px] font-medium ${hasData ? "" : "text-[#80838E]"}`}
      >
        Export All PDFs
      </p>
    </div>
  );
};

export default Fill_All_PDFs_API;
