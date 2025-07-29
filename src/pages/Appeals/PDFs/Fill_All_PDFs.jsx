import { Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import POA_CCA from "../../../assets/PDFs/POA_CCA.pdf";
import POA_BOR from "../../../assets/PDFs/POA_BOR.pdf";
import Representation_Agreement from "../../../assets/PDFs/Representation_Agreement2.pdf";
import Appeal_Narrative from "../../../assets/PDFs/Appeal_Narrative_2.pdf";
import Sales_Questions from "../../../assets/PDFs/salesquest.pdf";

import PropTypes from "prop-types";
import { setFieldPDF } from "@/utiles/setFieldPDF";
import { formatePin } from "@/utiles/formatePin";
import { useCallback, useEffect, useState } from "react";
import { useGetTownshipNameMutation } from "@/redux/apiSlice";
import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";

const Fill_All_PDFs = ({ property, client, pin2, pin3, appeal_number }) => {
  const [townShip, setTownShip] = useState("");
  const hasProperty = Boolean(property);
  const hasClient = Boolean(client);
  const hasData = hasProperty && hasClient;
  const [getTownshipName, { isLoading }] = useGetTownshipNameMutation({});
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();

  const fillPOC_CCA = async () => {
    const formUrl = POA_CCA;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();

    setFieldPDF(form, "Appeal Year", currentYear.toString());
    setFieldPDF(form, "Property Index Numbers", formatePin(property?.pin));
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
      "whose name appears on the appeal form to represent me before the Assessor relative to the",
      "Hani Khatib"
    );
    setFieldPDF(
      form,
      "Print Name",
      `${client?.first_name} ${client?.last_name}`
    );
    setFieldPDF(
      form,
      "Date",
      `${currentMonth + 1}/${currentDay}/${currentYear}`
    );
    setFieldPDF(
      form,
      "Daytime Phone Number_2",
      client?.phone ? formatPhoneNumber(client?.phone) : ""
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
      `${client?.first_name} ${client?.last_name}`
    );
    setFieldPDF(
      form,
      "Property Index Numbers_2",
      `${pin2 ? formatePin(pin2) : ""}${pin3 && pin2 ? `,` : ""} ${pin3 ? formatePin(pin3) : ""}`
    );

    const townShip_filed = form.getTextField("Text2");
    townShip_filed.setFontSize(8);
    townShip_filed.setText(townShip);
    setFieldPDF(form, "Text3", property.state);
    setFieldPDF(form, "Text6", `${currentYear}`);
    setFieldPDF(form, "Text7", "IL");
    await pdfDoc.save();
    return pdfDoc;
  };
  const fillPOA_BOR = async () => {
    const formUrl = POA_BOR;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    form.getTextField("PINs 1").setFontSize(10);
    form.getTextField("PINs 2").setFontSize(10);
    form.getTextField("PINs 3").setFontSize(10);
    setFieldPDF(form, "PINs 1", `${formatePin(property?.pin)}`);
    setFieldPDF(form, "PINs 2", `${pin2 ? `${formatePin(pin2)}` : ""}`);
    setFieldPDF(form, "PINs 3", `${pin3 ? `${formatePin(pin3)}` : ""}`);
    setFieldPDF(form, "undefined", property?.zip_code);
    setFieldPDF(form, "City", property?.city);
    setFieldPDF(form, "ZIP Code", property?.state);
    setFieldPDF(form, "State", property?.address);
    setFieldPDF(form, "Township", townShip);
    setFieldPDF(
      form,
      "For assessment year 20 1",
      "Hani Khatib / Khatib Law, LLC"
    );
    setFieldPDF(
      form,
      "PrintNameofaffiant",
      `${client?.first_name} ${client?.last_name}`
    );
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
    await pdfDoc.save();

    return pdfDoc;
  };
  const fillRepresentation_Agreement = async () => {
    const formUrl = Representation_Agreement;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();

    setFieldPDF(
      form,
      "Date_RA",
      `${currentMonth + 1}/${currentDay}/${currentYear}`
    );
    setFieldPDF(
      form,
      "Client_RA",
      `${client?.first_name} ${client?.last_name}`
    );
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
    await pdfDoc.save();

    return pdfDoc;
  };
  const fillAppeal_Narrative = async () => {
    const formUrl = Appeal_Narrative;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    const currentYear = new Date().getFullYear();

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
    await pdfDoc.save();

    return pdfDoc;
  };
  const fillSales_Questions = async () => {
    const formUrl = Sales_Questions;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    setFieldPDF(form, "Text31", "IL");
    setFieldPDF(form, "Text32", "IL");

    setFieldPDF(form, "WWWCOOKCOUNTYASSESSORCOM 2", currentYear.toString());
    setFieldPDF(form, "Property Index Numbers", `${formatePin(property?.pin)}`);
    setFieldPDF(
      form,
      "Property Index Numbers_2",
      `${pin2 ? formatePin(pin2) : ""}  ${pin3 && pin2 ? `,` : ""} ${pin3 ? formatePin(pin3) : ""}`
    );

    setFieldPDF(form, "Zip", property?.zip_code);
    setFieldPDF(form, "City", property?.city);
    setFieldPDF(form, "Property Street Address", property?.address);
    setFieldPDF(form, "WWWCOOKCOUNTYASSESSORCOM 1", townShip);

    setFieldPDF(form, "Township", townShip);
    setFieldPDF(
      form,
      "Owner I Taxpayer",
      `${client?.first_name} ${client?.last_name}`
    );
    setFieldPDF(form, "Owners Mailing Address", `${client?.address}`);
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
      "Date",
      `${currentMonth + 1}/${currentDay}/${currentYear}`
    );
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
        Export All PDFs
      </p>
    </div>
  );
};

export default Fill_All_PDFs;
