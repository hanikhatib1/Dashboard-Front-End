import { PDFDocument } from "pdf-lib";


export default async function downloadPDF(pdf) {
    const response = await fetch(`${pdf.link}`);
    const pdfBytes = await response.arrayBuffer();

    const pdfDoc = await PDFDocument.load(pdfBytes);

    const modifiedPdfBytes = await pdfDoc.save();

    const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${pdf.name}.pdf`;
    downloadLink.click();
}