import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/UserSlice";
import employeeSlice from "./features/Employee";
import clientsSlice from "./features/Clients";
import townshipSlice from "./features/Township";
import propertiesSlice from "./features/Properties";
import appealSlice from "./features/AppealSlice";
import invoicesSlice from "./features/Invoices";
import contactUsSlice from "./features/ContactUs";

import { apiSlice } from "./apiSlice";


export const store = configureStore({
    reducer: {
        user: userSlice,
        employee: employeeSlice,
        clients: clientsSlice,
        townships: townshipSlice,
        properties: propertiesSlice,
        appeals: appealSlice,
        invoices: invoicesSlice,
        contactUs: contactUsSlice,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
            .concat(apiSlice.middleware)
})
