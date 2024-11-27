import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload
            state.isAuthenticated = true
            state.isLoading = false
        },
        logout: () => {
            return { ...initialState, isLoading: false };
        }
    }
})

export const { login, logout } = userSlice.actions

export default userSlice.reducer