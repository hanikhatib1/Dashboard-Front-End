import { Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import POA_BOR from "../../../assets/PDFs/POA_BOR.pdf";
import PropTypes from "prop-types";
import { setFieldPDF } from "@/utiles/setFieldPDF";
import { formatePin } from "@/utiles/formatePin";
import { useCallback, useEffect, useState } from "react";
import { useGetTownshipNameMutation } from "@/redux/apiSlice";

const FillPOC_BOR = ({ property, client, pin2, pin3 }) => {
  const [pins, setPins] = useState({
    pin2: "",
    pin3: "",
  });
  const [townShip, setTownShip] = useState("");
  const hasProperty = Boolean(property);
  const hasClient = Boolean(client);
  const hasData = hasProperty && hasClient;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();

  const [getTownshipName, { isLoading }] = useGetTownshipNameMutation({});
  const fillForm = async () => {
    // Step 1: Load the PDF form.
    const formUrl = POA_BOR;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    // Step 2: Retrieve the form fields.
    const form = pdfDoc.getForm();
    const fildes = form.getFields();
    form.getTextField("PINs 1").setFontSize(10);
    form.getTextField("PINs 2").setFontSize(10);
    form.getTextField("PINs 3").setFontSize(10);
    setFieldPDF(form, "PINs 1", `${formatePin(property?.pin)}`);
    setFieldPDF(
      form,
      "PINs 2",
      `${pins.pin2 ? `${formatePin(pins.pin2)}` : ""}`
    );
    setFieldPDF(
      form,
      "PINs 3",
      `${pins.pin3 ? `${formatePin(pins.pin3)}` : ""}`
    );
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
    link.download = `POC_BOR_Client_${client?.first_name}_${client?.last_name}.pdf`;
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

  useEffect(() => {
    setPins({ pin2, pin3 });
  }, [pin2, pin3]);

  return (
    <div
      onClick={hasData && !isLoading ? fillForm : undefined}
      className={`flex gap-2 !p-1 !bg-white !text-black items-center ${hasData && !isLoading ? "cursor-pointer hover:border-gray-400 rounded-[8px] overflow-hidden" : ""} border border-white `}
    >
      <Download color="#80838E" />
      <p
        className={`text-[16px] font-medium ${hasData && !isLoading ? "" : "text-[#80838E]"}`}
      >
        Export POA BOR
      </p>
    </div>
  );
};

FillPOC_BOR.propTypes = {
  property: PropTypes.object,
  client: PropTypes.object,
  pin2: PropTypes.string,
  pin3: PropTypes.string,
};

export default FillPOC_BOR;
