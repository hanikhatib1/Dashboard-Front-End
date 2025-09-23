export const formatDateMonth = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "short" }; // Jun, Jul, etc.
  const month = date.toLocaleString("en-US", options);
  const day = String(date.getDate()).padStart(2, "0");
  return { month, day };
};