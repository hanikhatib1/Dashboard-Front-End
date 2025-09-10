import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import signature from "@/assets/images/sign.jpg";
import { formatePin } from "./utiles/formatePin";
import { formattedNumber } from "./utiles/formattedNumber";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    lineHeight: 1.6,
    fontFamily: "Times-Roman",
  },
  section: { marginBottom: 12 },
  title: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 2,
    fontWeight: "bold",
  },
  bold: { fontWeight: "bold" },
  paragraph: { marginBottom: 10, textAlign: "justify" },
  line: { marginBottom: 0 },
  signatureImg: { width: 120, height: 30, marginTop: 10, marginBottom: 10 },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f2f2f2",
    padding: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: "center",
  },
  tableHeader: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  tableImage: {
    width: "70%",
    height: 125,
    marginBottom: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },
});

const AppealPDF4 = ({ reportData, clientName = "" }) => {
  const currentDate = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  const rowKeys = [
    "pin",
    "address",
    "city",
    "class",
    "neighborhood",
    "exterior_construction",
    "age",
    "building_sq_ft",
    "land_assessment",
    "full_bath",
    "half_bath",
    "ac",
    "garage",
    "basement",
    "building_av/sf.",
  ];

  const getValue = (item, key) => {
    if (key === "building_sq_ft") return item["building_sq_ft"] || "-";
    if (key === "ac") return item["ac"] || "-";
    if (key === "address")
      return item["address"]?.address || item["address"] || "-";
    if (key === "building_av/sf.")
      return item["building_av/sf."] || item["building_av/sf"] || "-";
    if (key === "pin") return formatePin(item["pin"] ? item["pin"] : "") || "-";
    if (key === "exterior_construction")
      return item["exterior_construction"] || "-";

    return item[key] || "-";
  };

  const subjectData = reportData.properties?.[0] || {};
  let comparableData1 = reportData.properties?.slice(1, 4) || [];

  if (comparableData1.length < 3) {
    const emptyEntries = Array(3 - comparableData1.length).fill({});
    comparableData1.push(...emptyEntries);
  }
  const comparableData2 = reportData.properties?.slice(4, 7) || [];
  if (comparableData2.length < 3) {
    const emptyEntries = Array(3 - comparableData2.length).fill({});
    comparableData2.push(...emptyEntries);
  }

  const markers = reportData?.properties
    .slice(0, 7)
    .map(({ latitude, longitude }, index) => {
      if (index === 0)
        return `markers=color:blue%7Clabel:S%7C${latitude},${longitude}`;
      else
        return `markers=color:red%7Clabel:${index}%7C${latitude},${longitude}`;
    })
    .join("&");

  const properties = reportData?.properties.slice(0, 7);

  const avgLat =
    properties.reduce((sum, p) => sum + p.latitude, 0) / properties.length;

  const avgLng =
    properties.reduce((sum, p) => sum + p.longitude, 0) / properties.length;

  const center = `${avgLat},${avgLng}`;

  const imageSize = "600x400";

  const lats = properties.map((p) => p.latitude);
  const lngs = properties.map((p) => p.longitude);

  const latDiff = Math.max(...lats) - Math.min(...lats);
  const lngDiff = Math.max(...lngs) - Math.min(...lngs);

  const maxDiff = Math.max(latDiff, lngDiff);

  let zoom = 14;
  if (maxDiff > 10) zoom = 5;
  else if (maxDiff > 5) zoom = 7;
  else if (maxDiff > 2) zoom = 9;
  else if (maxDiff > 1) zoom = 10;
  else if (maxDiff > 0.5) zoom = 11;
  else if (maxDiff > 0.2) zoom = 12;
  else if (maxDiff > 0.1) zoom = 13;
  else if (maxDiff > 0.05) zoom = 14;
  else zoom = 15;

  const maptype = "roadmap";
  const mapImage = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&size=${imageSize}&maptype=${maptype}&${markers}&zoom=${zoom}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;

  return (
    <Document title={`${clientName} appeal narrative`} subject="ssss">
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>COOK COUNTY BOARD OF REVIEW</Text>
          <Text style={styles.subtitle}>
            RESIDENTIAL APPEAL BASED ON LACK OF UNIFORMITY
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.line}>Date: {formattedDate}</Text>
          <Text style={{ ...styles.line, marginBottom: "6px" }}>
            RE: Owner Name: {clientName}
          </Text>

          <Text style={styles.line}>
            Township: {reportData.properties[0].township}
          </Text>
          <Text style={{ ...styles.line, marginBottom: "6px" }}>
            Property PIN: {formatePin(reportData?.subject_pin)}
          </Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Text style={styles.line}>Address:</Text>
            <View
            /* style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "10px",
              }} */
            >
              <Text style={styles.line}>
                {reportData.properties[0].address}
              </Text>
              <Text style={styles.line}>
                {reportData.properties[0].city},{" "}
                {reportData.properties[0].state}{" "}
                {reportData.properties[0].zip_code}
              </Text>
            </View>
          </View>
        </View>

        {/* التحية والافتتاح */}
        <View style={styles.section}>
          <Text>
            To the Honorable Members of the Cook County Board of Review:
          </Text>
          <Text style={styles.paragraph}>
            Now comes the Taxpayer, {clientName}, by and through their attorney,
            Hani Khatib, and respectfully requests the Cook County Board of
            Review reduce the Assessed Valuation (AV) of the subject residential
            property on the grounds of lack of uniformity with comparable
            properties in the same location (township and neighborhood) and
            property class code.
          </Text>
        </View>

        {/* Basis of Appeal */}
        <View style={styles.section}>
          <Text style={styles.bold}>Basis of Appeal</Text>
          <Text style={styles.paragraph}>
            The Illinois Constitution, Article IX, Section 4(a), and applicable
            statutes, including{" "}
            <Text style={{ color: "blue", textDecoration: "underline" }}>
              35 ILCS 200/16-55,
            </Text>{" "}
            require that properties be assessed uniformly. Our analysis of
            comparable residential properties demonstrates that the subject
            property is assessed at a disproportionately higher per-square-foot
            value than similarly situated homes of like class, size, and age.
          </Text>
        </View>

        {/* Supporting Evidence */}
        <View style={styles.section}>
          <Text style={styles.bold}>Supporting Evidence (per CCBOR Rules)</Text>
          <Text style={{ marginBottom: 6 }}>
            In compliance with the Boards rules, the following are submitted:
          </Text>
          <Text>
            • <Text style={{ fontWeight: "bold" }}>Exhibit A:</Text> Recent
            color photograph of the subject property (taken within the past
            twelve months).
          </Text>
          <Text>
            • <Text style={{ fontWeight: "bold" }}>Exhibit B:</Text> Comparable
            Properties Matrix Report
          </Text>
          <Text>
            • <Text style={{ fontWeight: "bold" }}>Exhibit C:</Text> Comparable
            photos and map identifying comparable properties located in the same
            neighborhood and tax code.
          </Text>
        </View>

        <View style={{ ...styles.section, marginTop: 20 }}>
          <Text style={styles.bold}>Equity Ratio Analysis</Text>
          <Text>
            • Subject Property Building AV per Sq. Ft. : $
            {reportData.properties[0]["building_av/sf"]}
          </Text>
          <Text>
            • Average Building AV per Sq. Ft. of Comparables: $
            {reportData["avg_building_av/sf"]}
          </Text>
          <Text>
            • Over-Assessment Difference AV per Sq. Ft. : $
            {Number(
              reportData.properties[0]["building_av/sf"] -
                reportData["avg_building_av/sf"]
            ).toLocaleString()}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            This disparity demonstrates that the subject property is being
            over-assessed by approximately
            {`$${Number(
              reportData.total_assessment - reportData.requested_total
            ).toLocaleString()}`}{" "}
            compared to neighborhood standards.
          </Text>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.bold}>Legal Authority</Text>
          <Text style={styles.paragraph}>
            Under Illinois law, property assessments must be equitable and
            uniform. The Illinois Supreme Court has consistently held that
            assessments must reflect uniformity in relation to comparable
            properties (Kankakee County Board of Review v. Property Tax Appeal
            Board, 131 Ill. 2d 1 (1989)). Additionally,{" "}
            <Text style={{ color: "blue", textDecoration: "underline" }}>
              35 ILCS 200/16-55
            </Text>{" "}
            provides taxpayers the right to appeal assessments that are not
            uniform with comparable properties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Requested Reduction</Text>
          <Text style={{ ...styles.paragraph, marginBottom: 10 }}>
            We respectfully request that the Assessed Valuation of the subject
            property be reduced as follows:
          </Text>
          <Text style={styles.line}>
            • Land AV: ${formattedNumber(reportData.land_assessment)}
          </Text>
          <Text style={styles.line}>
            • Building AV: $
            {formattedNumber(
              reportData.suggested_building_assessed_value,
              true
            )}
          </Text>
          <Text style={{ ...styles.line, marginBottom: 12 }}>
            • AV: ${formattedNumber(reportData.requested_total_av, true)}
          </Text>
          <Text style={styles.paragraph}>
            This adjustment would bring the subject property's assessment in
            line with uniform standards, ensuring compliance with both statutory
            and constitutional requirements.
          </Text>
        </View>

        <View style={styles.signature}>
          <Text>Respectfully submitted,</Text>
          <Image src={signature} style={styles.signatureImg} />
          <Text>______________________</Text>
          <Text>Hani Khatib</Text>
          <Text>Khatib Law, LLC</Text>
          <Text>Attorney for Taxpayer {clientName}</Text>
          <Text>Board of Review No. 11352</Text>
        </View>

        <View style={styles.section}>
          <Text
            style={{
              ...styles.exhibitTitle,
              textAlign: "center",
              marginTop: "40px",
              fontWeight: "bold",
              marginBottom: 0,
            }}
          >
            EXHIBIT A
          </Text>
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            Recent Photo of Subject Property
          </Text>
        </View>
        <Image
          style={styles.tableImage}
          src={`${import.meta.env.VITE_BASE_URL_BACKEND}/property/image_proxy?url=${encodeURIComponent(reportData?.properties[0].property_image)}`}
        />
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.section}>
            <Text
              style={{
                ...styles.exhibitTitle,
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: 0,
              }}
            >
              EXHIBIT B
            </Text>
            <Text style={{ ...styles.tableHeader, fontWeight: "bold" }}>
              Comparable Property Analysis/Evidence Sheet
            </Text>
          </View>
          {/* {reportData?.properties?.length > 0 && (
          )} */}
          <View style={styles.table}>
            {/* صف العناوين */}
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}></Text>
              <Text style={styles.tableColHeader}>SUBJECT</Text>
              {comparableData1.map((comp, index) => (
                <Text
                  key={`comp-header-${index}`}
                  style={styles.tableColHeader}
                >{`COMPARABLE ${index + 1}`}</Text>
              ))}
            </View>

            {/* استخدام map() لإنشاء صفوف البيانات */}
            {rowKeys.map((key, index) => (
              <View style={styles.tableRow} key={key}>
                <Text
                  style={{
                    ...styles.tableColHeader,
                    textTransform: "capitalize",
                  }}
                >
                  {key?.replace("_", " ")}
                </Text>
                <Text
                  style={{
                    ...styles.tableCol,
                    color: key === "building_av/sf." ? "red" : "black",
                    fontSize: key === "pin" ? 10 : 12,
                  }}
                >
                  {getValue(subjectData, key)}
                </Text>

                {comparableData1.map((comp, compIndex) => (
                  <Text
                    style={{
                      ...styles.tableCol,
                      color: key === "building_av/sf." ? "blue" : "black",
                      fontSize: key === "pin" ? 10 : 12,
                    }}
                    key={`comp-data-${index}-${compIndex}`}
                  >
                    {getValue(comp, key)}
                  </Text>
                ))}
              </View>
            ))}
          </View>
          {/* <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}></Text>
              <Text style={styles.tableColHeader}>SUBJECT</Text>
              <Text style={styles.tableColHeader}>COMPARABLE 1</Text>
              <Text style={styles.tableColHeader}>COMPARABLE 2</Text>
              <Text style={styles.tableColHeader}>COMPARABLE 3</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>PIN</Text>
              <Text style={styles.tableCol}>27-29-216-007-00</Text>
              <Text style={styles.tableCol}>27-29-404-005-00</Text>
              <Text style={styles.tableCol}>27-29-215-010-00</Text>
              <Text style={styles.tableCol}>27-29-215-018-00</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Address</Text>
              <Text style={styles.tableCol}>17060 Warbler Ln</Text>
              <Text style={styles.tableCol}>17140 Deer Run Dr</Text>
              <Text style={styles.tableCol}>10750 W Egret</Text>
              <Text style={styles.tableCol}>16012 Great Egret</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>City</Text>
              <Text style={styles.tableCol}>Orland Park</Text>
              <Text style={styles.tableCol}>Orland Park</Text>
              <Text style={styles.tableCol}>Orland Park</Text>
              <Text style={styles.tableCol}>Orland Park</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Class</Text>
              <Text style={styles.tableCol}>278</Text>
              <Text style={styles.tableCol}>278</Text>
              <Text style={styles.tableCol}>278</Text>
              <Text style={styles.tableCol}>278</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Neighborhood</Text>
              <Text style={styles.tableCol}>100</Text>
              <Text style={styles.tableCol}>100</Text>
              <Text style={styles.tableCol}>100</Text>
              <Text style={styles.tableCol}>100</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Exterior</Text>
              <Text style={styles.tableCol}>Frame/Masonry</Text>
              <Text style={styles.tableCol}>Frame/Masonry</Text>
              <Text style={styles.tableCol}>Frame/Masonry</Text>
              <Text style={styles.tableCol}>Frame/Masonry</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Age</Text>
              <Text style={styles.tableCol}>25</Text>
              <Text style={styles.tableCol}>25</Text>
              <Text style={styles.tableCol}>24</Text>
              <Text style={styles.tableCol}>28</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Build Sqft</Text>
              <Text style={styles.tableCol}>2850</Text>
              <Text style={styles.tableCol}>2957</Text>
              <Text style={styles.tableCol}>2837</Text>
              <Text style={styles.tableCol}>3132</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Land Sqft</Text>
              <Text style={styles.tableCol}>13,950</Text>
              <Text style={styles.tableCol}>17,600</Text>
              <Text style={styles.tableCol}>12,690</Text>
              <Text style={styles.tableCol}>15,146</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Distance</Text>
              <Text style={styles.tableCol}>-</Text>
              <Text style={styles.tableCol}>0.12 Miles</Text>
              <Text style={styles.tableCol}>0.07 Miles</Text>
              <Text style={styles.tableCol}>0.21 Miles</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Full Bath</Text>
              <Text style={styles.tableCol}>2</Text>
              <Text style={styles.tableCol}>3</Text>
              <Text style={styles.tableCol}>3</Text>
              <Text style={styles.tableCol}>3</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Half Bath</Text>
              <Text style={styles.tableCol}>1</Text>
              <Text style={styles.tableCol}>1</Text>
              <Text style={styles.tableCol}>0</Text>
              <Text style={styles.tableCol}>0</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Air Condition</Text>
              <Text style={styles.tableCol}>Yes</Text>
              <Text style={styles.tableCol}>Yes</Text>
              <Text style={styles.tableCol}>Yes</Text>
              <Text style={styles.tableCol}>Yes</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Garage</Text>
              <Text style={styles.tableCol}>3 Car</Text>
              <Text style={styles.tableCol}>3 Car</Text>
              <Text style={styles.tableCol}>2 Car</Text>
              <Text style={styles.tableCol}>3 Car</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Basement</Text>
              <Text style={styles.tableCol}>Full</Text>
              <Text style={styles.tableCol}>Partial</Text>
              <Text style={styles.tableCol}>Full</Text>
              <Text style={styles.tableCol}>Full</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Bldg AV</Text>
              <Text style={{ ...styles.tableCol, color: "red" }}>14.59</Text>
              <Text style={{ ...styles.tableCol, color: "blue" }}>13.04</Text>
              <Text style={{ ...styles.tableCol, color: "blue" }}>13.44</Text>
              <Text style={{ ...styles.tableCol, color: "blue" }}>11.57</Text>
            </View>
          </View> */}
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}></Text>
            <Text style={styles.tableColHeader}>SUBJECT</Text>
            {comparableData1.map((comp, index) => (
              <Text
                key={`comp-header-${index}`}
                style={styles.tableColHeader}
              >{`COMPARABLE ${index + 4}`}</Text>
            ))}
          </View>

          {/* استخدام map() لإنشاء صفوف البيانات */}
          {rowKeys.map((key, index) => (
            <View style={styles.tableRow} key={key}>
              <Text
                style={{
                  ...styles.tableColHeader,
                  textTransform: "capitalize",
                }}
              >
                {key?.replace("_", " ")}
                {/* toLocaleLowerCase() */}
              </Text>
              <Text
                style={{
                  ...styles.tableCol,
                  color: key === "building_av/sf." ? "red" : "black",
                  fontSize: key === "pin" ? 10 : 12,
                }}
              >
                {getValue(subjectData, key)}
              </Text>

              {comparableData2.map((comp, compIndex) => (
                <Text
                  style={{
                    ...styles.tableCol,
                    color: key === "building_av/sf." ? "blue" : "black",
                    fontSize: key === "pin" ? 10 : 12,
                  }}
                  key={`comp-data-${index}-${compIndex}`}
                >
                  {getValue(comp, key)}
                </Text>
              ))}
            </View>
          ))}
        </View>
        {/*  <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}></Text>
            <Text style={styles.tableColHeader}>SUBJECT</Text>
            <Text style={styles.tableColHeader}>COMPARABLE 1</Text>
            <Text style={styles.tableColHeader}>COMPARABLE 2</Text>
            <Text style={styles.tableColHeader}>COMPARABLE 3</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>PIN</Text>
            <Text style={styles.tableCol}>27-29-216-007-00</Text>
            <Text style={styles.tableCol}>27-29-404-005-00</Text>
            <Text style={styles.tableCol}>27-29-215-010-00</Text>
            <Text style={styles.tableCol}>27-29-215-018-00</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Address</Text>
            <Text style={styles.tableCol}>17060 Warbler Ln</Text>
            <Text style={styles.tableCol}>17140 Deer Run Dr</Text>
            <Text style={styles.tableCol}>10750 W Egret</Text>
            <Text style={styles.tableCol}>16012 Great Egret</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>City</Text>
            <Text style={styles.tableCol}>Orland Park</Text>
            <Text style={styles.tableCol}>Orland Park</Text>
            <Text style={styles.tableCol}>Orland Park</Text>
            <Text style={styles.tableCol}>Orland Park</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Class</Text>
            <Text style={styles.tableCol}>278</Text>
            <Text style={styles.tableCol}>278</Text>
            <Text style={styles.tableCol}>278</Text>
            <Text style={styles.tableCol}>278</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Neighborhood</Text>
            <Text style={styles.tableCol}>100</Text>
            <Text style={styles.tableCol}>100</Text>
            <Text style={styles.tableCol}>100</Text>
            <Text style={styles.tableCol}>100</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Exterior</Text>
            <Text style={styles.tableCol}>Frame/Masonry</Text>
            <Text style={styles.tableCol}>Frame/Masonry</Text>
            <Text style={styles.tableCol}>Frame/Masonry</Text>
            <Text style={styles.tableCol}>Frame/Masonry</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Age</Text>
            <Text style={styles.tableCol}>25</Text>
            <Text style={styles.tableCol}>25</Text>
            <Text style={styles.tableCol}>24</Text>
            <Text style={styles.tableCol}>28</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Build Sqft</Text>
            <Text style={styles.tableCol}>2850</Text>
            <Text style={styles.tableCol}>2957</Text>
            <Text style={styles.tableCol}>2837</Text>
            <Text style={styles.tableCol}>3132</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Land Sqft</Text>
            <Text style={styles.tableCol}>13,950</Text>
            <Text style={styles.tableCol}>17,600</Text>
            <Text style={styles.tableCol}>12,690</Text>
            <Text style={styles.tableCol}>15,146</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Distance</Text>
            <Text style={styles.tableCol}>-</Text>
            <Text style={styles.tableCol}>0.12 Miles</Text>
            <Text style={styles.tableCol}>0.07 Miles</Text>
            <Text style={styles.tableCol}>0.21 Miles</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Full Bath</Text>
            <Text style={styles.tableCol}>2</Text>
            <Text style={styles.tableCol}>3</Text>
            <Text style={styles.tableCol}>3</Text>
            <Text style={styles.tableCol}>3</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Half Bath</Text>
            <Text style={styles.tableCol}>1</Text>
            <Text style={styles.tableCol}>1</Text>
            <Text style={styles.tableCol}>0</Text>
            <Text style={styles.tableCol}>0</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Air Condition</Text>
            <Text style={styles.tableCol}>Yes</Text>
            <Text style={styles.tableCol}>Yes</Text>
            <Text style={styles.tableCol}>Yes</Text>
            <Text style={styles.tableCol}>Yes</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Garage</Text>
            <Text style={styles.tableCol}>3 Car</Text>
            <Text style={styles.tableCol}>3 Car</Text>
            <Text style={styles.tableCol}>2 Car</Text>
            <Text style={styles.tableCol}>3 Car</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Basement</Text>
            <Text style={styles.tableCol}>Full</Text>
            <Text style={styles.tableCol}>Partial</Text>
            <Text style={styles.tableCol}>Full</Text>
            <Text style={styles.tableCol}>Full</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Bldg AV</Text>
            <Text style={{ ...styles.tableCol, color: "red" }}>14.59</Text>
            <Text style={{ ...styles.tableCol, color: "blue" }}>13.04</Text>
            <Text style={{ ...styles.tableCol, color: "blue" }}>13.44</Text>
            <Text style={{ ...styles.tableCol, color: "blue" }}>11.57</Text>
          </View>
        </View> */}
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text
            style={{
              ...styles.exhibitTitle,
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 0,
            }}
          >
            EXHIBIT C
          </Text>
          <Text style={styles.tableHeader}>Comparable Photos and Map </Text>
        </View>
        <Image
          style={{
            ...styles.tableImage,
            height: 200,
          }}
          src={mapImage}
        />
      </Page>
    </Document>
  );
};

export default AppealPDF4;
