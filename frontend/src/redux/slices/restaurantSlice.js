import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

// Fetch all restaurants with optional filters
export const fetchRestaurants = createAsyncThunk(
  'restaurant/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      const response = await api.get(`/api/restaurants?${queryParams}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurants');
    }
  }
);

// Fetch a single restaurant by ID (used by RestaurantPage.js)
export const fetchRestaurantDetails = createAsyncThunk(
  'restaurant/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/restaurants/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurant');
    }
  }
);

// Fetch restaurant by ID (alternative to fetchRestaurantDetails)
export const fetchRestaurantById = createAsyncThunk(
  'restaurant/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/restaurants/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurant');
    }
  }
);

// Fetch restaurant profile
export const fetchRestaurantProfile = createAsyncThunk(
  'restaurant/fetchRestaurantProfile',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/restaurants/${restaurantId}/profile`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurant profile');
    }
  }
);

// Fetch restaurant metrics (used by RestaurantDashboard.js)
export const fetchRestaurantMetrics = createAsyncThunk(
  'restaurant/fetchMetrics',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/restaurants/${restaurantId}/metrics`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurant metrics');
    }
  }
);

// Register a new restaurant
export const registerRestaurant = createAsyncThunk(
  'restaurant/registerRestaurant',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/restaurant/signup', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Update restaurant profile
export const updateRestaurantProfile = createAsyncThunk(
  'restaurant/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/restaurants/${formData.restaurantId}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update restaurant profile');
    }
  }
);

// Update restaurant rating
export const updateRating = createAsyncThunk(
  'restaurant/updateRating',
  async ({ restaurantId, rating }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/restaurants/${restaurantId}/rating`, { rating });
      return { restaurantId, rating, averageRating: response.data.averageRating };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update rating');
    }
  }
);

const initialState = {
  restaurants: [],
  currentRestaurant: null,
  categories: [],
  metrics: null,
  menu: [],
  isLoading: false,
  error: null,
  userRatings: {},
  filters: {
    category: null,
    rating: null,
    priceRange: null,
    search: '',
  },
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: null,
        rating: null,
        priceRange: null,
        search: '',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all restaurants
      .addCase(fetchRestaurants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.restaurants = action.payload.restaurants;
        state.categories = action.payload.categories || state.categories;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch restaurant by ID
      .addCase(fetchRestaurantById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRestaurant = action.payload;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch restaurant details (includes menu for RestaurantPage.js)
      .addCase(fetchRestaurantDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRestaurant = action.payload.restaurant;
        state.menu = action.payload.menu || [];
      })
      .addCase(fetchRestaurantDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch restaurant profile
      .addCase(fetchRestaurantProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRestaurant = action.payload;
      })
      .addCase(fetchRestaurantProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch restaurant metrics
      .addCase(fetchRestaurantMetrics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchRestaurantMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register restaurant
      .addCase(registerRestaurant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerRestaurant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRestaurant = action.payload;
      })
      .addCase(registerRestaurant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update restaurant profile
      .addCase(updateRestaurantProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRestaurantProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRestaurant = action.payload;
        const index = state.restaurants.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.restaurants[index] = action.payload;
        }
      })
      .addCase(updateRestaurantProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update restaurant rating
      .addCase(updateRating.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRating.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userRatings = {
          ...state.userRatings,
          [action.payload.restaurantId]: action.payload.rating,
        };
        const index = state.restaurants.findIndex((r) => r.id === action.payload.restaurantId);
        if (index !== -1) {
          state.restaurants[index].rating = action.payload.averageRating;
        }
        if (state.currentRestaurant && state.currentRestaurant.id === action.payload.restaurantId) {
          state.currentRestaurant.rating = action.payload.averageRating;
        }
      })
      .addCase(updateRating.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError } = restaurantSlice.actions;
export default restaurantSlice.reducer;