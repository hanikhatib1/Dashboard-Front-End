import { createSlice } from "@reduxjs/toolkit";

export const propertiesSlice = createSlice({
  name: "properties",
  initialState: {
    propertiesList: [],
    mainProperty: null,
    propertyDetails: null,
    propertyDetailsData: [],
    editPurchaseProperty: null,
    deletePurchaseProperty: null,
    pageCountComparison: 1,
  },
  reducers: {
    setMainProperty: (state, action) => {
      state.mainProperty = action.payload;
    },
    setPropertiesList: (state, action) => {
      const newPropertiesList = state.propertiesList;
      newPropertiesList.push(action.payload);
      state.propertiesList = newPropertiesList;
    },
    clearPropertiesList: (state) => {
      state.propertiesList = [];
    },
    deletePropertiesById: (state, action) => {
      const data = state.propertiesList;
      state.propertiesList = data.filter(
        (propertyPin) => propertyPin !== action.payload
      );
    },
    setPropertyDetails: (state, action) => {
      state.propertyDetails = action.payload;
    },

    setPropertyDetailsData: (state, action) => {
      const property = action.payload.property;
      const index = action.payload.index;
      const s = state.propertyDetailsData.find(
        (item) => item.pin === property.pin
      );
      if (!s)
        if (index === 0) state.propertyDetailsData = [property];
        else
          state.propertyDetailsData = [...state.propertyDetailsData, property];
    },
    deletePropertyDetailsDataById: (state, action) => {
      const updatedProperties = state.propertyDetailsData.filter(
        (property) => property.pin !== action.payload
      );
      state.propertyDetailsData = updatedProperties;
    },
    setEditPurchaseProperty: (state, action) => {
      state.editPurchaseProperty = action.payload;
    },
    steDeletePurchaseProperty: (state, action) => {
      state.deletePurchaseProperty = action.payload;
    },
    setPageCountStore: (state, action) => {
      state.pageCountComparison = action.payload;
    },
  },
});

export const {
  deletePropertyDetailsDataById,
  steDeletePurchaseProperty,
  setEditPurchaseProperty,
  setPropertyDetailsData,
  setPropertiesList,
  deletePropertiesById,
  setMainProperty,
  clearPropertiesList,
  setPropertyDetails,
  setPageCountStore,
} = propertiesSlice.actions;

export default propertiesSlice.reducer;
