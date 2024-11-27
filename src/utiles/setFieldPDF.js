export const setFieldPDF = (form, fieldName, value, font) => {
    const field = form.getTextField(fieldName);
    field.setText(`${value}`);
    if (font)
        form.getTextField(fieldName).setFontSize(font);
};