import { createSlice } from "@reduxjs/toolkit"


export const appealSlice = createSlice({
    name: 'appeals',
    initialState: {
        appeals: null,
        editAppealData: null,
        deleteAppealData: null,
        appealToInvoice: null,
        appealInvoiceDetails: null,
        formsAppeal: null,
        documentsStatusAppealModel: null
    },
    reducers: {
        setAppeals: (state, action) => {
            state.appeals = action.payload
        },
        setEditAppealData: (state, action) => {
            state.editAppealData = action.payload
        },
        setDeleteAppealData: (state, action) => {
            state.deleteAppealData = action.payload
        },
        addAppealToInvoice: (state, action) => {
            state.appealToInvoice = action.payload
        },
        setAppealInvoiceDetails: (state, action) => {
            state.appealInvoiceDetails = action.payload
        },
        setFormsAppeal: (state, action) => {
            state.formsAppeal = action.payload
        },
        setDocumentsStatusAppealModel: (state, action) => {
            state.documentsStatusAppealModel = action.payload
        },
    }
})


export const { setAppeals, setDocumentsStatusAppealModel, setFormsAppeal, setEditAppealData, setDeleteAppealData, addAppealToInvoice, setAppealInvoiceDetails } = appealSlice.actions

export default appealSlice.reducer