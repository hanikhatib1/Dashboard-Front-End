import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { Toaster } from "./components/ui/toaster.jsx";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import AppealPDF from "./AppealPDF.jsx";
import AppealPDF2 from "./AppealPDF2.jsx";

const sampleData = {
  taxpayer: "Carmen Servin",
  address: "2612 Harvey Ave, Berwyn, IL 60402",
  pin: "16-29-302-023-0000",
  attorneyId: "11352",
  attorneyName: "Hani H. Khatib",
  seller: "Juan Valerio Corpus",
  buyer: "Carmen Servin",
  purchaseDate: "May 03, 2024",
  purchasePrice: 296000,
  landAV: 46310,
  buildingAV: 249690,
  totalAV: 296000,
  imageUrl:
    "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
         <Toaster className="!bg-white" />
        {/* <PDFDownloadLink
          document={<AppealPDF data={sampleData} />}
          fileName="CookCounty_Appeal.pdf"
        >
          {({ loading }) => (loading ? "Loading PDF..." : "Download PDF")}
        </PDFDownloadLink> */}
       {/*  <div className="border h-[100vh] w-full">
          <PDFViewer width="100%" height="100%">
            <AppealPDF2 />
          </PDFViewer>
        </div> */}
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
