import { createSlice } from "@reduxjs/toolkit"


export const invoiceSlice = createSlice({
    name: 'invoice',
    initialState: {
        invoices: null,
        editInvoiceData: null,
        deleteInvoiceData: null
    },
    reducers: {
        setInvoices: (state, action) => {
            state.appeals = action.payload
        },
        setEditInvoiceData: (state, action) => {
            state.editInvoiceData = action.payload
        },
        setDeleteInvoiceData: (state, action) => {
            state.deleteInvoiceData = action.payload
        }
    }
})


export const { setInvoices, setEditInvoiceData, setDeleteInvoiceData } = invoiceSlice.actions

export default invoiceSlice.reducer