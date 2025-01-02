export const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber === null || phoneNumber === undefined || phoneNumber === '')
        return "";
    const phone = phoneNumber.replace('-', "");
    let s = []
    const s1 = phone.substring(0, 3).replace('-', "");
    if (s1) s.push(s1);
    const s2 = phone.substring(3, 6).replace('-', "");
    if (s2) s.push(s2);
    const s3 = phone.substring(6, 11).replace('-', "");
    if (s3) s.push(s3);

    return s.join('-');
};