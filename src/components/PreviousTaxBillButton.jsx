import React from "react";

const PreviousTaxBillButton = ({ pin }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/property/secound_tax_bill?pin=${pin}`
      );

      if (!res.ok) return;

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `tax-bill-${pin}.pdf`;
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
      className="btn bg-white border border-red-800 rounded-[12px] text-red-800 hover:bg-red-800 hover:text-white px-4 py-2"
    >
      {isLoading ? "Downloading..." : "Previous Tax Bill"}
    </button>
  );
};

export default PreviousTaxBillButton;
