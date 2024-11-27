export const formatePin = (pin) => {
    const digits = pin.replace(/\D/g, "");

    let formattedValue = digits;
    if (digits.length > 2) {
        formattedValue = digits.slice(0, 2) + "-" + digits.slice(2);
    }
    if (digits.length > 4) {
        formattedValue =
            formattedValue.slice(0, 5) + "-" + formattedValue.slice(5);
    }
    if (digits.length > 7) {
        formattedValue =
            formattedValue.slice(0, 9) + "-" + formattedValue.slice(9);
    }
    if (digits.length > 10) {
        formattedValue =
            formattedValue.slice(0, 13) + "-" + formattedValue.slice(13, 17);
    }

    return formattedValue;

    // return `${pin.slice(0, 2)}-${pin.slice(2, 4)}-${pin.slice(4, 7)}-${pin.slice(7, 10)}-${pin.slice(10, 14)}`
}