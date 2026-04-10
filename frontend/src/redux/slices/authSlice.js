import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

// Login user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('userAuth', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Login restaurant
export const loginRestaurant = createAsyncThunk(
  'auth/loginRestaurant',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/restaurant/auth/login', { email, password });
      localStorage.setItem('restaurantAuth', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Restaurant login failed');
    }
  }
);

// Register user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Registering user with data:', userData);
      const response = await api.post('/api/auth/register', userData);
      localStorage.setItem('userAuth', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/user/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/api/user/profile', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user profile');
    }
  }
);

// Toggle favorite restaurant
export const toggleFavoriteRestaurant = createAsyncThunk(
  'auth/toggleFavoriteRestaurant',
  async (restaurantId, { getState, rejectWithValue }) => {
    try {
      const response = await api.post('/api/user/favorites/toggle', { restaurantId });
      return { restaurantId, isFavorite: response.data.isFavorite };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle favorite restaurant');
    }
  }
);

const initialState = {
  user: null,
  restaurant: null,
  isAuthenticated: false,
  isRestaurant: false,
  isLoading: false,
  error: null,
  favoriteRestaurants: [], // Added to store user's favorite restaurants
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.restaurant = null;
      state.isAuthenticated = false;
      state.isRestaurant = false;
      state.favoriteRestaurants = [];
      localStorage.removeItem('userAuth');
      localStorage.removeItem('restaurantAuth');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.favoriteRestaurants = action.payload.user.favoriteRestaurants || [];
        state.isAuthenticated = true;
        state.isRestaurant = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login restaurant
      .addCase(loginRestaurant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginRestaurant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.restaurant = action.payload.restaurant;
        state.isAuthenticated = true;
        state.isRestaurant = true;
      })
      .addCase(loginRestaurant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.favoriteRestaurants = action.payload.user.favoriteRestaurants || [];
        state.isAuthenticated = true;
        state.isRestaurant = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.favoriteRestaurants = action.payload.favoriteRestaurants || [];
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.favoriteRestaurants = action.payload.favoriteRestaurants || [];
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Toggle favorite restaurant
      .addCase(toggleFavoriteRestaurant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleFavoriteRestaurant.fulfilled, (state, action) => {
        state.isLoading = false;
        const { restaurantId, isFavorite } = action.payload;
        if (isFavorite) {
          state.favoriteRestaurants.push(restaurantId);
        } else {
          state.favoriteRestaurants = state.favoriteRestaurants.filter(
            (id) => id !== restaurantId
          );
        }
      })
      .addCase(toggleFavoriteRestaurant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;