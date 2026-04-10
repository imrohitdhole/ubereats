import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLocationModalOpen: false,
  isFilterModalOpen: false,
  isLoading: false,
  toast: {
    message: '',
    type: 'info', // 'success', 'error', 'info'
    isVisible: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleLocationModal: (state) => {
      state.isLocationModalOpen = !state.isLocationModalOpen;
    },
    toggleFilterModal: (state) => {
      state.isFilterModalOpen = !state.isFilterModalOpen;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || 'info',
        isVisible: true,
      };
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
    },
    clearToast: (state) => {
      state.toast = {
        message: '',
        type: 'info',
        isVisible: false,
      };
    },
  },
});

export const { 
  toggleLocationModal, 
  toggleFilterModal, 
  setLoading,
  showToast,
  hideToast,
  clearToast,
} = uiSlice.actions;

export default uiSlice.reducer;