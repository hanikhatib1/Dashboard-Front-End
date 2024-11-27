import { Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import POA_CCA from "../../../assets/PDFs/POA_CCA.pdf";
import PropTypes from "prop-types";
import { setFieldPDF } from "@/utiles/setFieldPDF";
import { formatePin } from "@/utiles/formatePin";
import { useCallback, useEffect, useState } from "react";
import { useGetTownshipNameMutation } from "@/redux/apiSlice";
import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";

const FillPOC_CCA = ({ property, client, pin2, pin3 }) => {
  const [townShip, setTownShip] = useState("");
  const hasProperty = Boolean(property);
  const hasClient = Boolean(client);
  const hasData = hasProperty && hasClient;
  const [getTownshipName, { isLoading }] = useGetTownshipNameMutation({});
  const fillForm = async () => {
    // Step 1: Load the PDF form.
    const formUrl = POA_CCA;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    // Step 2: Retrieve the form fields.
    const form = pdfDoc.getForm();
    const fildes = form.getFields();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();

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
    // setFieldPDF(form, "Text2", townShip);
    setFieldPDF(form, "Text3", property.state);
    /* setFieldPDF(form, "Text4", "Text4");
    setFieldPDF(form, "Text5", "Text5"); */
    setFieldPDF(form, "Text6", `${currentYear}`);
    setFieldPDF(form, "Text7", 'IL');

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
    link.download = `POC_CCA_Client_${client?.first_name}_${client?.last_name}.pdf`;
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
        Export POA CCA
      </p>
    </div>
  );
};

FillPOC_CCA.propTypes = {
  property: PropTypes.object,
  client: PropTypes.object,
  pin2: PropTypes.string,
  pin3: PropTypes.string,
};

export default FillPOC_CCA;
