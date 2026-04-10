import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  deliveryMode: 'delivery', // 'delivery' or 'pickup'
  selectedLocation: null,
  searchTerm: '',
  googleMapsApiKey: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setDeliveryMode: (state, action) => {
      state.deliveryMode = action.payload;
    },
    setLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setGoogleMapsApiKey: (state, action) => {
      state.googleMapsApiKey = action.payload;
    },
  },
});

export const { setDeliveryMode, setLocation, setSearchTerm, setGoogleMapsApiKey } = appSlice.actions;
export default appSlice.reducer;