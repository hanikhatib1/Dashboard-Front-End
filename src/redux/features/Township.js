import { createSlice } from "@reduxjs/toolkit";

export const townshipSlice = createSlice({
  name: "township",
  initialState: {
    townships: null,
    editTownshipData: null,
    migrateTownshipData: null,
  },
  reducers: {
    setTownships: (state, action) => {
      state.townships = action.payload;
    },
    updateTownshipById: (state, action) => {
      const updatedData = action.payload;
      console.log("updatedData", updatedData);
      state.townships.data = state.townships.data.map((township) =>
        township.id === updatedData.id ? updatedData : township
      );
    },
    setEditTownshipData: (state, action) => {
      state.editTownshipData = action.payload;
    },
    setMigrateTownshipData: (state, action) => {
      state.migrateTownshipData = action.payload;
    },
  },
});

export const {
  setTownships,
  updateTownshipById,
  setEditTownshipData,
  setMigrateTownshipData,
} = townshipSlice.actions;

export default townshipSlice.reducer;
