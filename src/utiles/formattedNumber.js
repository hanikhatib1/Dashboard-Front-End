export const formattedNumber = (number, removeDecimal) => {
    if (!number) return ""
    let formattedNumber = number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (formattedNumber.endsWith(".00")) {
        formattedNumber = formattedNumber.slice(0, -3);
    }

    if (removeDecimal) {
        formattedNumber = formattedNumber.split(".")[0];
    }

    return formattedNumber;
}