import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchSchedule = createAsyncThunk(
  'schedule/fetchSchedule',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/schedule/${restaurantId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch schedule');
    }
  }
);

export const updateSchedule = createAsyncThunk(
  'schedule/updateSchedule',
  async (scheduleData, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/schedule/${scheduleData.restaurantId}`, scheduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update schedule');
    }
  }
);

const initialState = {
  isOpen: false,
  selectedDate: "",
  selectedTime: "11:00 PM - 11:30 PM",
  isScheduled: false,
  schedule: null,
  isLoading: false,
  error: null,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
      // Initialize with today's date as default
      const today = new Date();
      const options = { weekday: "short", month: "short", day: "numeric" };
      state.selectedDate = today.toLocaleDateString("en-US", options);
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    selectDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    selectTime: (state, action) => {
      state.selectedTime = action.payload;
    },
    scheduleDelivery: (state) => {
      state.isScheduled = true;
      state.isOpen = false;
    },
    deliverNow: (state) => {
      state.isScheduled = false;
      state.isOpen = false;
    },
    resetSchedule: (state) => {
      state.isScheduled = false;
      state.selectedDate = "";
      state.selectedTime = "11:00 PM - 11:30 PM";
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch schedule
      .addCase(fetchSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schedule = action.payload;
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update schedule
      .addCase(updateSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schedule = action.payload;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  openModal, 
  closeModal, 
  selectDate, 
  selectTime,
  scheduleDelivery,
  deliverNow,
  resetSchedule,
  clearError,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;