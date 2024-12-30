import { PDFDocument } from "pdf-lib";
import Client_Forms from "../../../assets/PDFs/Client_Forms.pdf";
import { setFieldPDF } from "@/utiles/setFieldPDF";
import { formatePin } from "@/utiles/formatePin";
import { formatPhoneNumber } from "@/utiles/formatPhoneNumber";
import PropTypes from "prop-types";
import {
  useExportAppealDataMutation,
  useSendFormSignatureMutation,
} from "@/redux/apiSlice";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useSelector } from "react-redux";

const Fill_Form_Client = ({
  client_email,
  pin1,
  pin2,
  pin3,
  text,
  className,
}) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();
  const [exportAppealData] = useExportAppealDataMutation();
  const [sendForm] = useSendFormSignatureMutation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { formsAppeal } = useSelector((state) => state.appeals);

  const fillPOC_CCA = async () => {
    setIsLoading(true);
    const res = await exportAppealData({
      client_email,
      pin1,
      pin2,
      pin3,
    });
    if ("error" in res) {
      toast({
        title: "Error",
        description:
          "Error in exporting the data, please make sure you have entered the correct email and PINs",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    if ("data" in res) {
      // Step 1: Load the PDF form.
      const formUrl = Client_Forms;
      const formPdfBytes = await fetch(formUrl).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(formPdfBytes);
      // Step 2: Retrieve the form fields.
      const form = pdfDoc.getForm();

      setFieldPDF(form, "Appeal Year", currentYear.toString());
      setFieldPDF(
        form,
        "Property Index Numbers",
        formatePin(res.data?.data.pin1)
      );
      setFieldPDF(
        form,
        "Property Street Address",
        res.data?.data.property_address
      );
      setFieldPDF(form, "City", res.data?.data.property_city);
      setFieldPDF(form, "Zip", res.data?.data.property_zipcode);
      setFieldPDF(form, "Township", res.data.data.property_township);
      setFieldPDF(form, "Owner I Taxpayer", `${res.data?.data.client_name}`);
      setFieldPDF(
        form,
        "Owners Mailing Address",
        res.data?.data.client_address
      );
      setFieldPDF(form, "City_2", res.data?.data.client_city);
      setFieldPDF(form, "Zip_2", res.data?.data.client_zipcode);
      setFieldPDF(
        form,
        "Daytime Phone Number",
        res.data?.data.client_phone
          ? formatPhoneNumber(res.data?.data.client_phone)
          : ""
      );
      setFieldPDF(form, "Email Address", res.data?.data.client_email);

      setFieldPDF(
        form,
        "whose name appears on the appeal form to represent me before the Assessor relative to the",
        "Hani Khatib"
      );
      setFieldPDF(form, "Print Name", `${res.data?.data.client_name}`);
      setFieldPDF(
        form,
        "Date",
        `${currentMonth + 1}/${currentDay}/${currentYear}`
      );
      setFieldPDF(
        form,
        "Daytime Phone Number_2",
        res.data?.data.client_phone
          ? formatPhoneNumber(res.data?.data.client_phone)
          : ""
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
        `${res.data?.data.client_name}`
      );
      setFieldPDF(
        form,
        "Property Index Numbers_2",
        `${res.data.data.pin2 ? formatePin(res.data.data.pin2) : ""}  ${res.data.data.pin3 && res.data.data.pin2 ? `,` : ""} ${res.data.data.pin3 ? formatePin(res.data.data.pin3) : ""}`
      );

      const townShip_filed = form.getTextField("Text2");
      townShip_filed.setFontSize(8);
      townShip_filed.setText(res.data?.data.property_township);
      setFieldPDF(form, "Text3", res.data.data.property_state);
      setFieldPDF(form, "Text6", `${currentYear}`);
      setFieldPDF(form, "Text7", "IL");

      /* ////////////////////// */

      form.getTextField("PINs 1_BOR").setFontSize(10);
      form.getTextField("PINs 2_BOR").setFontSize(10);
      form.getTextField("PINs 3_BOR").setFontSize(10);
      setFieldPDF(form, "PINs 1_BOR", `${formatePin(res.data?.data.pin1)}`);
      setFieldPDF(
        form,
        "PINs 2_BOR",
        `${res.data.data.pin2 ? `${formatePin(res.data.data.pin2)}` : ""}`
      );
      setFieldPDF(
        form,
        "PINs 3_BOR",
        `${res.data.data.pin3 ? `${formatePin(res.data.data.pin3)}` : ""}`
      );
      setFieldPDF(form, "undefined_BOR", res.data?.data.property_zipcode);
      setFieldPDF(form, "City_BOR", res.data?.data.property_city);
      setFieldPDF(form, "ZIP Code_BOR", res.data?.data.property_state);
      setFieldPDF(form, "State_BOR", res.data?.data.property_address);
      setFieldPDF(form, "Township", res.data.data.property_township);
      setFieldPDF(
        form,
        "For assessment year 20 1_BOR",
        "Hani Khatib / Khatib Law, LLC"
      );
      setFieldPDF(
        form,
        "PrintNameofaffiant_BOR",
        `${res.data?.data.client_name}`
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
      /* setFieldPDF(form, "BOR Atty Code", "11352"); */

      /* /////////////////////////////// */

      setFieldPDF(
        form,
        "Date",
        `${currentMonth + 1}/${currentDay}/${currentYear}`
      );
      setFieldPDF(form, "Client_RA", ` ${res.data?.data.client_name}`);
      setFieldPDF(
        form,
        "Property Address_RA",
        `${res.data?.data.client_address}`
      );
      setFieldPDF(
        form,
        "PINs_RA",
        `${formatePin(res.data?.data.pin1)} ${res.data?.data.pin2 ? `,${formatePin(res.data?.data.pin2)}` : ""} ${res.data?.data.pin3 ? `,${formatePin(res.data?.data.pin3)}` : ""}`
      );
      setFieldPDF(
        form,
        "Date_RA",
        `${currentMonth + 1}/${currentDay}/${currentYear}`
      );
      setFieldPDF(
        form,
        "Mailing Address_RA",
        `${formatPhoneNumber(res.data?.data.property_address)}`
      );

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      const formData = new FormData();
      formData.append(
        "document",
        blob,
        `${res.data?.data.client_name}-Form.pdf`
      );
      formData.append("user_name", res.data?.data.client_name);
      formData.append("signer_email", res.data?.data.client_email);
      formData.append("appeal_id", formsAppeal.id);

      const res2 = await sendForm(formData);
      if ("data" in res2) {
        toast({
          title: "Success",
          description: "Form sent successfully",
          variant: "success",
        });
      }
      if ("error" in res2) {
        toast({
          title: "Error",
          description: "Error sending the form",
          variant: "error",
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={() => fillPOC_CCA()}
      disabled={isLoading}
      className={`${className} bg-primary rounded-[8px]  text-white flex items-center justify-center cursor-pointer px-4`}
    >
      <p>{isLoading ? "Loading..." : text ? text : "Send Form"}</p>
    </div>
  );
};

Fill_Form_Client.propTypes = {
  client_email: PropTypes.string,
  pin1: PropTypes.string,
  pin2: PropTypes.string,
  pin3: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default Fill_Form_Client;
