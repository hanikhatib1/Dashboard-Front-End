import { createSlice } from "@reduxjs/toolkit";

export const clientSlice = createSlice({
    name: 'clients',
    initialState: {
        clients: null,
        editClientData: null
    },
    reducers: {
        setClients: (state, action) => {
            state.clients = action.payload
        },
        deleteClientById: (state, action) => {
            const data = state.clients.data
            state.clients.data = data.filter(client => client.id !== action.payload);
        },
        updateClientById: (state, action) => {
            const updatedData = action.payload;
            state.clients.data = state.clients.data.map(client =>
                client.id === updatedData.id ? { ...client, ...updatedData } : client
            );
        },
        setEditClientData: (state, action) => {
            state.editClientData = action.payload
        }
    }
})

export const { setClients, deleteClientById, updateClientById, setEditClientData } = clientSlice.actions

export default clientSlice.reducer