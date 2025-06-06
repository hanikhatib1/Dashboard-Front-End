import { Download } from "lucide-react";
import { useGetReportDataMutation } from "@/redux/apiSlice";
import PropTypes from "prop-types";
import { setFieldPDF } from "@/utiles/setFieldPDF";
import { PDFDocument, StandardFonts, TextAlignment } from "pdf-lib";
import ReportPDF2 from "../assets/PDFs/Report_Blank.pdf";
import { formatePin } from "@/utiles/formatePin";
import { formattedNumber } from "@/utiles/formattedNumber";
import Loader from "./Loader";

const comparableData = [
  { x: 320, y: 270, label: "COMPARABLE 1" },
  { x: 460, y: 270, label: "COMPARABLE 2" },
  { x: 320, y: 150, label: "COMPARABLE 3" },
  { x: 460, y: 150, label: "COMPARABLE 4" },
  { x: 320, y: 30, label: "COMPARABLE 5" },
  { x: 460, y: 30, label: "COMPARABLE 6" },
];

const FileReportPDF2 = ({ mainPin, pins }) => {
  const [getReportData, { isLoading }] = useGetReportDataMutation();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();
  const currentDate = `${currentMonth + 1}/${currentDay}/${currentYear}`;

  const fillForm = async () => {
    const res = await getReportData({
      comparable_property_pin: mainPin,
      pins: pins.slice(0, 8),
    });

    if ("error" in res) return null;
    const reportData = res.data;
    const formPdfBytes = await fetch(ReportPDF2).then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const form = pdfDoc.getForm();
    const pages = pdfDoc.getPages();
    const secondPage = pages[1];

    const fildes = form.getFields();
    for (let i = 0; i < fildes.length; i++) {
      setFieldPDF(form, fildes[i].getName(), fildes[i].getName());
      //form.getTextField(fildes[i].getName()).setAlignment(TextAlignment.Left);
      //console.log("fildes", fildes[i].getName());
    }

    /* Header */
    setFieldPDF(form, "Date", `${currentDate}`);
    setFieldPDF(
      form,
      "Subject Property Full",
      `${reportData?.data.property_full_address}`
    );
    setFieldPDF(
      form,
      "Subject Property PIN",
      `${formatePin(reportData?.data.subject_pin)}`
    );
    setFieldPDF(form, "Township", "Orland Township");

    /* First Table  */
    setFieldPDF(
      form,
      "CY Land Assessment",
      `$ ${formattedNumber(reportData?.data.land_assessment)}`
    );
    setFieldPDF(
      form,
      "CY Building Assesment",
      `$ ${formattedNumber(reportData?.data.building_assessment)}`
    );
    setFieldPDF(
      form,
      "CY Total Assessment",
      `$ ${formattedNumber(reportData?.data.total_assessment)}`
    );
    setFieldPDF(
      form,
      "PY Land Assessmenet",
      `$ ${formattedNumber(reportData?.data.past_land_assessment)}`
    );
    setFieldPDF(
      form,
      "PY Building Assessment",
      `$ ${formattedNumber(reportData?.data.past_building_assessment)}`
    );
    setFieldPDF(
      form,
      "PY Total Assessment",
      `$ ${formattedNumber(reportData?.data.past_total_assessment)}`
    );
    setFieldPDF(
      form,
      "Requested Land Assessment",
      `$ ${formattedNumber(reportData?.data.land_assessment)}`
    );
    setFieldPDF(
      form,
      "Requested  building Assessment",
      `$ ${formattedNumber(reportData?.data.suggested_building_assessed_value)}`
    );
    setFieldPDF(
      form,
      "Requested Total Assessment",
      `$ ${formattedNumber(reportData?.data.requested_total,true)}`
    );

    /* Second Table */
    setFieldPDF(
      form,
      "Suggested Equalty Ratio",
      `$ ${reportData?.data["avg_building_av/sf"]}`
    );
    setFieldPDF(
      form,
      "Building Are",
      `${reportData?.data.building_area_in_sf}`
    );
    setFieldPDF(
      form,
      "Suggested building assessed",
      `$ ${formattedNumber(reportData?.data.building_area_in_sf)}`
    );
    setFieldPDF(
      form,
      "Land Assesment",
      `$ ${formattedNumber(reportData?.data.land_assessment)}`
    );
    setFieldPDF(
      form,
      "Property Assessmesnt",
      `$ ${formattedNumber(reportData?.data.requested_total_av, true)}`
    );
    setFieldPDF(
      form,
      "Fair Build AV/SF",
      `$ ${formattedNumber(reportData?.data.suggested_building_assessed_value, true)}`
    );
    setFieldPDF(
      form,
      "Requested Market Value",
      `$ ${formattedNumber(reportData?.data.requested_market_value)}`
    );

    /* Third Table */
    setFieldPDF(
      form,
      "Requested Total AV",
      `$ ${formattedNumber(reportData?.data.requested_total_av,true)}`
    );
    setFieldPDF(
      form,
      "AVG Building AV/SF",
      `$ ${formattedNumber(reportData?.data["avg_building_av/sf"])}`
    );

    /* Comparison Table */

    if (reportData?.data?.properties?.length > 0) {
      reportData?.data?.properties?.map((item, index) => {
        if (index === 0) {
          setFieldPDF(form, `Subject Property Address`, item.address);
          setFieldPDF(form, `Subject Property City`, item.city);
          setFieldPDF(form, `Subject Property Neighborhood`, item.neighborhood);
          setFieldPDF(form, `Subject Property Tax Code`, item.taxcode);
          setFieldPDF(form, "Subject Property Full Bath", item.full_bath);
          setFieldPDF(form, `Subject Property  Basement`, item.basement);
          setFieldPDF(form, `Subject Property Attic`, item.attic);
          setFieldPDF(form, `Subject Property Age`, item.age);
          setFieldPDF(form, `Subject Property Township`, item.township);
          setFieldPDF(form, `Subject Property Class`, item.class);
          setFieldPDF(form, `Subject Property Description`, item.description);
          setFieldPDF(form, `Subject Property Central Air`, item.ac);
          setFieldPDF(
            form,
            `Subject Property Exterior`,
            item.exterior_construction
          );
          setFieldPDF(
            form,
            `Subject Property # of Fireplaces`,
            item.number_of_fireplaces
          );
          setFieldPDF(form, `Subject Property Garage Size`, item.garage);
          setFieldPDF(form, `Subject Property Use`, item.user);
          setFieldPDF(
            form,
            `Subject Property Land Assessment`,
            item.land_assessment
          );
          setFieldPDF(
            form,
            `Subject Property Building Assessment`,
            item.building_assessment
          );
          setFieldPDF(form, `Subject Property Half  Bath`, item.half_bath);
          setFieldPDF(
            form,
            `Subject Property Building Area`,
            item["building_sq_ft"]
          );
          setFieldPDF(
            form,
            `Subject Property Building AV`,
            item["building_av/sf"]
          );
        } else {
          setFieldPDF(form, `COMPARABLE ${index} PIN`, formatePin(item.pin));
          setFieldPDF(
            form,
            `COMPARABLE ${index} Address`,
            item.address.address
          );
          setFieldPDF(form, `COMPARABLE ${index} City`, item.city);
          setFieldPDF(
            form,
            `COMPARABLE ${index} Neighborhood`,
            item.neighborhood
          );
          setFieldPDF(form, `COMPARABLE ${index} Tax Code`, item.taxcode);
          setFieldPDF(form, `COMPARABLE ${index} Full Bath`, item.full_bath);
          setFieldPDF(form, `COMPARABLE ${index} Basement`, item.basement);
          setFieldPDF(form, `COMPARABLE ${index} Attic`, item.attic);
          setFieldPDF(
            form,
            `COMPARABLE ${index} Exterior`,
            item.exterior_construction
          );
          setFieldPDF(
            form,
            `COMPARABLE ${index} # of Fireplaces`,
            item.number_of_fireplaces
          );
          setFieldPDF(form, `COMPARABLE ${index} Use`, item.user);
          setFieldPDF(
            form,
            `COMPARABLE ${index} ${index === 4 ? "garage Size" : "Garage Size"}`,
            item.garage
          );

          setFieldPDF(
            form,
            `COMPARABLE ${index} ${index === 2 || index === 3 ? " Age" : "Age"}`,
            item.age
          );
          setFieldPDF(
            form,
            `COMPARABLE ${index} ${index === 4 ? "Description'" : "Description"}`,
            item.description
          );
          setFieldPDF(
            form,
            `${index === 3 ? "Comparable" : "COMPARABLE"} ${index} Township`,
            item.township
          );
          setFieldPDF(
            form,
            `${index === 3 ? "Comparable" : "COMPARABLE"} ${index} Class`,
            item.class
          );
          setFieldPDF(
            form,
            `COMPARABLE ${index} Half ${index === 6 ? "Bathroom" : "Bath"}`,
            item.half_bath
          );
          setFieldPDF(
            form,
            `COMPARABLE ${index} Central ${index === 5 ? "AIr" : "Air"}`,
            item.ac
          );

          setFieldPDF(
            form,
            `${index === 3 ? "3073COMPARABLE" : "COMPARABLE"} ${index} Building Area`,
            item["building_sq_ft"]
          );
          setFieldPDF(
            form,
            `COMPARABLE ${index} ${index === 2 || index === 3 ? "" : "Building "}${index === 5 ? "Av" : "AV"}`,
            item["building_av/sf."]
          );
          setFieldPDF(
            form,
            `COMPARABLE ${index}${index === 1 ? "Building Assesment" : ` Building ${index === 5 ? "Assessement" : index === 6 ? "Assesment" : "Assessment"}`}`,
            item.building_assessment
          );
          setFieldPDF(
            form,
            `COMPARABLE ${index} Land ${index === 4 ? "Assesmment" : index === 5 || index === 6 ? "Assesment" : "Assessment"}`,
            item.land_assessment
          );

          form
            .getTextField(
              `COMPARABLE ${index} ${index === 2 || index === 3 ? "" : "Building "}${index === 5 ? "Av" : "AV"}`
            )
            .setAlignment(TextAlignment.Center);
        }
      });
    }

    /* Images */

    const setImageXY = (secondPage, jpgImage, index) => {
      const dataXY = comparableData[index];
      secondPage.drawImage(jpgImage, {
        x: dataXY.x,
        y: dataXY.y,
        width: 130,
        height: 90,
      });
      /* secondPage.drawText(dataXY.label, {
        x: dataXY.x,
        y: dataXY.y - 15,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      }); */
    };

    if (reportData?.data?.properties[0]) {
      const jpgUrl = reportData?.data?.properties[0].property_image;
      const jpgImageBytes = await fetch(jpgUrl).then((res) =>
        res.arrayBuffer()
      );
      const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
      pages[0].drawImage(jpgImage, {
        x: 445,
        y: 588,
        width: 140,
        height: 68,
      });
    }

    if (reportData?.data?.properties[0]) {
      const jpgUrl = reportData?.data?.properties[0].property_image;
      const jpgImageBytes = await fetch(jpgUrl).then((res) =>
        res.arrayBuffer()
      );
      const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
      secondPage.drawImage(jpgImage, {
        x: 80,
        y: 30,
        width: 180,
        height: 80,
      });
    }

    if (reportData?.data?.properties[1]) {
      const jpgUrl = reportData?.data?.properties[1].property_image;
      const jpgImageBytes = await fetch(jpgUrl).then((res) =>
        res.arrayBuffer()
      );
      const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
      setImageXY(secondPage, jpgImage, 0);
    }

    if (reportData?.data?.properties[2]) {
      const jpgUrl = reportData?.data?.properties[2].property_image;

      const jpgImageBytes = await fetch(jpgUrl).then((res) =>
        res.arrayBuffer()
      );
      const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
      setImageXY(secondPage, jpgImage, 1);
    }

    if (reportData?.data?.properties[3]) {
      const jpgUrl = reportData?.data?.properties[2].property_image;

      const jpgImageBytes = await fetch(jpgUrl).then((res) =>
        res.arrayBuffer()
      );
      const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
      setImageXY(secondPage, jpgImage, 2);
    }

    if (reportData?.data?.properties[4]) {
      const jpgUrl = reportData?.data?.properties[3].property_image;

      const jpgImageBytes = await fetch(jpgUrl).then((res) =>
        res.arrayBuffer()
      );
      const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
      setImageXY(secondPage, jpgImage, 3);
    }

    if (reportData?.data?.properties[5]) {
      const jpgUrl = reportData?.data?.properties[4].property_image;

      const jpgImageBytes = await fetch(jpgUrl).then((res) =>
        res.arrayBuffer()
      );
      const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
      setImageXY(secondPage, jpgImage, 4);
    }

    if (reportData?.data?.properties[6]) {
      const jpgUrl = reportData?.data?.properties[5].property_image;

      const jpgImageBytes = await fetch(jpgUrl).then((res) =>
        res.arrayBuffer()
      );
      const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
      setImageXY(secondPage, jpgImage, 5);
    }

    const markers = reportData?.data?.properties
      .slice(0, 7)
      .map(({ latitude, longitude }, index) => {
        if (index === 0)
          return `markers=color:blue%%7Clabel:S%7C${latitude},${longitude}`;
        else
          return `markers=color:red%%7Clabel:${index}%7C${latitude},${longitude}`;
      })
      .join("&");
    const imageSize = "600x400";
    const center = `${reportData?.data?.properties[0].latitude},${reportData?.data?.properties[0].longitude}`;
    const zoom = 16;
    const maptype = "roadmap";
    const mapImage = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&size=${imageSize}&maptype=${maptype}&${markers}&zoom=${zoom}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;

    const jpgImageBytes = await fetch(mapImage).then((res) =>
      res.arrayBuffer()
    );
    const jpgImage = await pdfDoc.embedPng(jpgImageBytes);
    secondPage.drawImage(jpgImage, {
      x: 25,
      y: 160,
      width: 280,
      height: 220,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Report.pdf`;
    link.click();
  };

  return (
    <div
      onClick={fillForm}
      className="border !bg-primary rounded-[8px] h-[40px] w-max md:w-[145px] text-white px-2 flex items-center gap-1 justify-center cursor-pointer"
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Download color="#fff" size={20} />
          <p className="!text-[14px] font-medium hidden md:block">Export Report</p>
        </>
      )}
    </div>
  );
};

FileReportPDF2.propTypes = {
  mainPin: PropTypes.string,
  pins: PropTypes.array.isRequired,
};

export default FileReportPDF2;
