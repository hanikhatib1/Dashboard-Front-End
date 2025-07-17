import { formatePin } from "@/utiles/formatePin";
import { formattedNumber } from "@/utiles/formattedNumber";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import PropTypes from "prop-types";

// إعداد التنسيقات
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 12, marginTop: 10 },
  bold: { fontWeight: "bold", textAlign: "center", fontSize: 16 },
});

const CookCountyAssessorpdf = ({ reportData, clientName }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();
  console.log("reportData", reportData);

  const avg_building_av = reportData?.["avg_building_av/sf"] ?? 0;
  const building_av = reportData.properties[0]?.["building_av/sf"] ?? 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>TO: </Text>
          <Text>The Honorable Fritz Kaegi</Text>
          <Text>Cook County Assessor’s Office</Text>
          <Text>118 North Clark Street, Rm 320</Text>
        </View>
        <View style={styles.section}>
          <Text style={{ marginBottom: 24 }}>
            DATE: {currentMonth + 1}/{currentDay}/{currentYear}
          </Text>
          <Text>
            RE: Request for Reduction in Assessed Valuation Due to Lack of
            Uniformity
          </Text>
        </View>
        <View style={styles.section}>
          <Text>Owner Name: {clientName}</Text>
          <Text style={{ marginTop: 5 }}>
            Township: {reportData?.properties[0]?.township}
          </Text>
          <Text style={{ marginTop: 5 }}>
            Property PIN: {formatePin(reportData?.properties[0]?.pin)}
          </Text>
          <Text style={{ marginTop: 5 }}>
            Property Address: {reportData?.properties[0]?.address},{" "}
            {reportData?.properties[0]?.city},{" "}
            {reportData?.properties[0]?.state},{" "}
            {reportData?.properties[0]?.zip_code}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={{ marginBottom: 5 }}>Dear Assessor Kaegi,</Text>
          <Text style={{ marginTop: 5 }}>
            Now comes the taxpayer, {clientName}, by and through their attorney,
            respectfully requesting a reduction in the Assessed Valuation (AV)
            of the property identified above. This request is based on a lack of
            uniformity in assessment when compared to similar properties within
            the same neighborhood and tax code.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", color: "#405E8D" }}>
            Basis for Appeal:
          </Text>
          <Text style={{ marginTop: 5 }}>
            Upon conducting a thorough review of the surrounding area, we
            identified {/* {reportData?.properties.length} */} comparable
            properties that are similar in size, age, location, classification,
            and building characteristics to the subject property. These
            comparables are all located within the same neighborhood and tax
            code. A review of similar properties indicates that all the selected
            comparables are assessed lower than the subject property, according
            to the records of the Cook County Assessor’s Office.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", color: "#405E8D" }}>
            Analysis:
          </Text>
          <Text style={{ marginTop: 5 }}>
            According to our findings, the average Building AV per square foot
            (also referred to as the Equity Ratio) for the selected comparable
            properties is ${formattedNumber(avg_building_av)}, while the subject
            property has a Building AV per square foot of $
            {formattedNumber(building_av)}. This indicates the subject property
            is over-assessed by ${" "}
            {Number(building_av - avg_building_av).toLocaleString()} per square
            foot
          </Text>
          <Text style={{ fontWeight: "bold", color: "#405E8D" ,marginTop: 20}}>
            Requested Relief:
          </Text>
          <Text style={{ marginTop: 5 }}>
            In light of the above, we respectfully request that the market value
            and assessed valuation for the subject property, identified by PIN
            {formatePin(reportData?.properties[0]?.pin)}, be revised as follows:
          </Text>
          <Text style={{ marginTop: 20 }}>
            Land AV: ${formattedNumber(reportData.land_assessment)}
          </Text>
          <Text>
            Building AV: ${formattedNumber(reportData.building_assessment)}
          </Text>
          <Text>Total AV: ${formattedNumber(reportData.total_assessment)}</Text>
          <Text>Market Value: ${formattedNumber(reportData.total_assessment * 10)}</Text>
          <Text style={{ marginTop: 5, marginBottom: 5 }}>
            Respectfully submitted,
          </Text>
        </View>
        <View style={styles.section}>
          <Text>Attorney for Taxpayer</Text>
          <Text>Attorney/Tax Representative Code Number: 11352</Text>
        </View>
        <View style={styles.section}>
          <Text
            style={{
              marginTop: 15,
              marginBottom: 5,
              fontWeight: "bold",
              color: "#405E8D",
            }}
          >
            Exhibit-A: Property Picture
          </Text>
          <Text style={{ marginTop: 5 }}>
            Exhibit A: Recent photo of subject property attached below
          </Text>
          <img
            src="https://maps.googleapis.com/maps/api/streetview?size=500x300&location=7636%20STICKNEY%20AVE%20BRIDGEVIEW%2C%20IL%2060455&key=AIzaSyB9OOQTWvViYtayTHY5orSSOx_lwacOD4o"
            alt="Property"
            style={{
              width: "100%",
              height: 300,
              marginTop: 10,
              objectFit: "cover"
            }}
          />
        </View>
      </Page>
    </Document>
  );
};
CookCountyAssessorpdf.propTypes = {
  reportData: PropTypes.shape({
    properties: PropTypes.arrayOf(
      PropTypes.shape({
        township: PropTypes.string,
        pin: PropTypes.string,
        address: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        zip_code: PropTypes.string,
      })
    ),
    "avg_building_av/sf": PropTypes.number,
    land_assessment: PropTypes.number,
    building_assessment: PropTypes.number,
    total_assessment: PropTypes.number,
  }),
  clientName: PropTypes.string,
};

export default CookCountyAssessorpdf;
