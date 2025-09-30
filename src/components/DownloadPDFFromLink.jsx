import React from "react";

const DownloadPDFFromLink = ({ urlPDF }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/property/download_tax_history_pdf`,
        {
          method: "POST",
          body: JSON.stringify({
            url: urlPDF,
          }),
        }
      );

      if (!res.ok) return;

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `tax.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Failed to download tax bill:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className="btn bg-white border border-red-400 rounded-[12px] text-red-400 hover:bg-red-400 hover:text-white px-4 py-2 w-max"
    >
      {isLoading ? "Downloading..." : "Download"}
    </button>
  );
};

export default DownloadPDFFromLink;
