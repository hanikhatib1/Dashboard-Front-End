export const countValues = (data, compareObj) => {
    const valueCounter = {};

    // Count the occurrences of each value in the data
    data.forEach(item => {
        if (valueCounter[item.value]) {
            valueCounter[item.value]++;
        } else {
            valueCounter[item.value] = 1;
        }
    });

    for (const key in compareObj) {
        if (compareObj.hasOwnProperty(key)) {
            if (valueCounter[key] !== compareObj[key]) {
                return false;
            }
        }
    }

    return true;
};