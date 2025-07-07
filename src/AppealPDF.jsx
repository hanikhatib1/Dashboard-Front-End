// components/AppealPDF.tsx
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
  section: { marginBottom: 12, marginTop: 24 },
  bold: { fontWeight: "bold", textAlign: "center", fontSize: 16 },
});

const AppealPDF = ({ editAppealData }) => (
  console.log("editAppealData", editAppealData),
  (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={{ ...styles.bold, marginTop: 50 }}>
          Board of Review Appeal
        </Text>
        <Text style={{ textAlign: "center" }}>
          (Overvaluation / Recent Purchase)
        </Text>
        <View style={styles.section}>
          <Text>Taxpayer: {editAppealData.client_name}</Text>
          <Text>
            Property Address: {editAppealData.property_address},{" "}
            {editAppealData.property_city}, {editAppealData.property_state},{" "}
            {editAppealData.property_zipcode}
          </Text>
          <Text>
            Property Index Number (PIN): {formatePin(editAppealData.pin1)}
          </Text>
          <Text>Board of Review Attorney ID: 11352</Text>
        </View>
        <View style={styles.section}>
          <Text style={{ marginBottom: 24 }}>
            TO THE HONORABLE MEMBERS OF THE COOK COUNTY BOARD OF REVIEW:
          </Text>
          <Text>
            NOW COMES, the Taxpayer, {editAppealData.sale_buyer_name}, by and
            through his attorney, Hani H. Khatib, and pursuant to Cook County
            Board of Review Rule #18, respectfully petitions this Honorable
            Board to reduce the Assessed Valuation (AV) of the subject property.
            In support thereof, the Taxpayer states as follows:
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold" }}>I. BASIS FOR APPEAL</Text>
          <Text style={{ marginTop: 5 }}>
            1. The subject property was recently purchased on for a total
            consideration of ${editAppealData.purchase_price}
          </Text>
          <Text style={{ marginTop: 10 }}>
            2. The buyer(s), {editAppealData.sale_buyer_name}, and the
            seller(s), Juan Valerio Corpus, were not related and had no prior
            personal or professional relationship. The transaction was conducted
            at arm’s length.
          </Text>
          <Text style={{ marginTop: 10 }}>
            3. The property was publicly marketed and listed through the
            Multiple Listing Service (MLS) under MLS number MRED #
            {editAppealData.purchase_doc_number}, and the final sale price
            reflects the property’s fair market value as of the date of sale.
          </Text>
          <Text style={{ marginTop: 10 }}>
            4. Based on this recent sale, the correct Assessed Valuation should
            be adjusted accordingly to reflect the market value established by
            the purchase price.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold" }}>
            II. REQUESTED ASSESSED VALUATION
          </Text>
          <Text style={{ marginTop: 5 }}>
            Land AV: ${editAppealData.land_av}
          </Text>
          <Text>
            Building AV: ${editAppealData.purchase_price} -{" "}
            {editAppealData.land_av}
          </Text>
          <Text>Total AV: ${editAppealData.total_av}</Text>
        </View>
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold" }}>
            III. SUPPORTING DOCUMENTATION
          </Text>
          <Text style={{ marginTop: 5 }}>
            • Exhibit A: Recent photograph of the subject property
          </Text>
          <Text>
            • Exhibit B: MLS listing and sales history of the subject property.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold" }}>WHEREFORE,</Text>
          <Text style={{ marginTop: 5 }}>
            Taxpayer respectfully requests that the Cook County Board of Review
            reduce the market value of the property located at{" "}
            {editAppealData.property_address}, {editAppealData.property_city},{" "}
            {editAppealData.property_state}, {editAppealData.property_zipcode},
            identified by PIN {formatePin(editAppealData.pin1)}, to reflect the
            purchase price of ${editAppealData.purchase_price}, and adjust the
            corresponding Assessed Valuation as stated above.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={{ marginTop: 5, marginBottom: 25 }}>
            Respectfully Submitted,
          </Text>
          <Text style={{ marginTop: 5 }}>Hani H. Khatib</Text>
          <Text style={{ marginTop: 5 }}>Attorney for Taxpayer</Text>
          <Text style={{ marginTop: 5 }}>Board of Review Number: 11352 </Text>
        </View>
        <View style={styles.section}>
          <Text style={{ marginTop: 25, marginBottom: 25, fontWeight: "bold" }}>
            Exhibit-A: Property Picture
          </Text>
          <Text style={{ marginTop: 5 }}>
            Recent picture of the subject property:
          </Text>
          <Image
            src={editAppealData.image}
            style={{
              width: "100%",
              height: 350,
              marginTop: 10,
              objectFit: "cover",
            }}
          />
        </View>
      </Page>
    </Document>
  )
);

export default AppealPDF;
