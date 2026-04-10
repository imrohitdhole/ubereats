// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import menuReducer from './slices/menuSlice';
import cartReducer from './slices/cartSlice';
import restaurantReducer from './slices/restaurantSlice';
import orderReducer from './slices/orderSlice';
import appReducer from './slices/appSlice';
import uiReducer from './slices/uiSlice';
import scheduleReducer from './slices/scheduleSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    cart: cartReducer,
    restaurant: restaurantReducer,
    order: orderReducer,
    app: appReducer,
    ui: uiReducer,
    schedule: scheduleReducer
  },
});

export default store;