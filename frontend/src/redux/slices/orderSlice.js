import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const createOrder = createAsyncThunk(
  'order/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/user/orders`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchRestaurantOrders = createAsyncThunk(
  'order/fetchRestaurantOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/restaurant/orders`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurant orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/orders/${orderId}/status`, { status });
      return { orderId, status, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

const initialState = {
  orders: [],
  restaurantOrders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  filter: 'all', // all, active, completed
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload); // Add to beginning of orders array
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch user orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch restaurant orders
      .addCase(fetchRestaurantOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.restaurantOrders = action.payload;
      })
      .addCase(fetchRestaurantOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update in orders array
        const userOrderIndex = state.orders.findIndex((order) => order.id === action.payload.orderId);
        if (userOrderIndex !== -1) {
          state.orders[userOrderIndex].order_status = action.payload.status;
        }
        const restaurantOrderIndex = state.restaurantOrders.findIndex((order) => order.id === action.payload.orderId);
        if (restaurantOrderIndex !== -1) {
          state.restaurantOrders[restaurantOrderIndex].order_status = action.payload.status;
        }
        // Update current order if it's the one being updated
        if (state.currentOrder && state.currentOrder.id === action.payload.orderId) {
          state.currentOrder.order_status = action.payload.status;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setOrderFilter, clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;