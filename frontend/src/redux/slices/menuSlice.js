import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchDishes = createAsyncThunk(
  'menu/fetchDishes',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/restaurants/${restaurantId}/dishes`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dishes');
    }
  }
);

export const addDish = createAsyncThunk(
  'menu/addDish',
  async (dishData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(dishData).forEach(([key, value]) => {
        if (key === 'image' && value) {
          formData.append(key, value);
        } else if (value) {
          formData.append(key, value);
        }
      });
      const response = await api.post(`/api/restaurants/${dishData.restaurantId}/dishes`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add dish');
    }
  }
);

export const updateDish = createAsyncThunk(
  'menu/updateDish',
  async ({ dishId, dishData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(dishData).forEach(([key, value]) => {
        if (key === 'image' && value) {
          formData.append(key, value);
        } else if (value) {
          formData.append(key, value);
        }
      });
      const response = await api.put(`/api/restaurants/${dishData.restaurantId}/dishes/${dishId}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update dish');
    }
  }
);

export const deleteDish = createAsyncThunk(
  'menu/deleteDish',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/restaurants/dishes/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete dish');
    }
  }
);

const initialState = {
  dishes: [],
  isOpen: false,
  isLoading: false,
  error: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    openMenu: (state) => {
      state.isOpen = true;
    },
    closeMenu: (state) => {
      state.isOpen = false;
    },
    toggleMenu: (state) => {
      state.isOpen = !state.isOpen;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dishes
      .addCase(fetchDishes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDishes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dishes = action.payload;
      })
      .addCase(fetchDishes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add dish
      .addCase(addDish.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addDish.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dishes.push(action.payload);
      })
      .addCase(addDish.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update dish
      .addCase(updateDish.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDish.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedDish = action.payload;
        state.dishes = state.dishes.map((dish) =>
          dish.id === updatedDish.id ? updatedDish : dish
        );
      })
      .addCase(updateDish.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete dish
      .addCase(deleteDish.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDish.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dishes = state.dishes.filter((dish) => dish.id !== action.payload.id);
      })
      .addCase(deleteDish.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { openMenu, closeMenu, toggleMenu, clearError } = menuSlice.actions;
export default menuSlice.reducer;