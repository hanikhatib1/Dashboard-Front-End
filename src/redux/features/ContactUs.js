import { createSlice } from "@reduxjs/toolkit";

export const contactUsSlice = createSlice({
    name: 'contactUs',
    initialState: {
        replayContactData: null,
    },
    reducers: {
        setReplayContactData: (state, action) => {
            state.replayContactData = action.payload
        },

    }
})

export const { setReplayContactData } = contactUsSlice.actions

export default contactUsSlice.reducer