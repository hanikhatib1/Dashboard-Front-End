import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { formatePin } from "./utiles/formatePin";

// إعداد التنسيقات
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 12, marginTop: 10 },
  bold: { fontWeight: "bold", textAlign: "center", fontSize: 16 },
});

/* import { Font } from "@react-pdf/renderer";

// Register Cambria
Font.register({
  family: "Cambria",
  src: "/fonts/Cambria.ttf",
}); */

const AppealPDF2 = ({ editAppealData, stateNumber }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();
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
          <Text>Owner Name: {editAppealData.client_name}</Text>
          <Text style={{ marginTop: 5 }}>
            Township: {editAppealData.property_township}
          </Text>
          <Text style={{ marginTop: 5 }}>
            Property PIN: {formatePin(editAppealData.pin1)}
          </Text>
          <Text style={{ marginTop: 5 }}>
            Property Address: {editAppealData.property_address},{" "}
            {editAppealData.property_city}, {editAppealData.property_state},{" "}
            {editAppealData.property_zipcode}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={{ marginBottom: 5 }}>Dear Assessor Kaegi,</Text>
          <Text style={{ marginTop: 5 }}>
            Now comes the taxpayer, {editAppealData.client_name}, by and through
            their attorney, respectfully requesting a reduction in the Assessed
            Valuation (AV) of the property identified above. This request is
            based on a lack of uniformity in assessment when compared to similar
            properties within the same neighborhood and tax code.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", color: "#405E8D" }}>
            Basis for Appeal:
          </Text>
          <Text style={{ marginTop: 5 }}>
            Upon conducting a thorough review of the surrounding area, we
            identified {stateNumber.numberOfComparison} comparable properties
            that are similar in size, age, location, classification, and
            building characteristics to the subject property. These comparables
            are all located within the same neighborhood and tax code. A review
            of similar properties indicates that all the selected comparables
            are assessed lower than the subject property, according to the
            records of the Cook County Assessor’s Office.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", color: "#405E8D" }}>
            Analysis:
          </Text>
          <Text style={{ marginTop: 5 }}>
            According to our findings, the average Building AV per square foot
            (also referred to as the Equity Ratio) for the selected comparable
            properties is ${editAppealData.land_av.toLocaleString()}, while the
            subject property has a Building AV per square foot of $
            {editAppealData.purchase_price.toLocaleString()}. This indicates the
            subject property is over-assessed by ${" "}
            {Number(
              editAppealData.purchase_price - editAppealData.land_av
            ).toLocaleString()}{" "}
            in Building AV. 
          </Text>

          <Text style={{ fontWeight: "bold", color: "#405E8D" }}>
            Requested Relief:
          </Text>
          <Text style={{ marginTop: 5 }}>
            In light of the above, we respectfully request that the market value
            and assessed valuation for the subject property, identified by PIN
            {formatePin(editAppealData.pin1)}, be revised as follows:
          </Text>
          <Text style={{ marginTop: 20 }}>
            Land AV: ${editAppealData.land_av.toLocaleString()}
          </Text>
          <Text>
            {" "}
            Building AV:${editAppealData.purchase_price.toLocaleString()}{" "}
          </Text>
          <Text>Total AV: ${editAppealData.total_av.toLocaleString()}</Text>
          <Text>Market Value: ${formattedNumber(reportData.total_assessment * 10)}</Text>
          <Text style={{ marginTop: 5, marginBottom: 5 }}>
            Respectfully submitted, 
          </Text>
        </View>
        <View style={styles.section}>
          <Text>Hani H. Khatib</Text>
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
         {/*  <Image
            src={editAppealData.image}
            style={{
              width: "100%",
              height: 300,
              marginTop: 10,
              objectFit: "cover",
            }}
          /> */}
        </View>
      </Page>
    </Document>
  );
};

export default AppealPDF2;
