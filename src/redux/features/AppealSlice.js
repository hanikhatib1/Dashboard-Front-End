import { createSlice } from "@reduxjs/toolkit"


export const appealSlice = createSlice({
    name: 'appeals',
    initialState: {
        appeals: null,
        editAppealData: null,
        deleteAppealData: null,
        appealToInvoice: null,
        appealInvoiceDetails: null
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
        }
    }
})


export const { setAppeals, setEditAppealData, setDeleteAppealData, addAppealToInvoice, setAppealInvoiceDetails } = appealSlice.actions

export default appealSlice.reducer