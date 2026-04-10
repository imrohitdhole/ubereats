import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("restaurantAuth");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("restaurantAuth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API Functions
export const login = (credentials) =>
  api.post('/auth/login', credentials).then((res) => res.data);

export const register = (userData) =>
  api.post('/auth/register', userData).then((res) => res.data);

export const getRestaurants = () =>
  api.get('/api/restaurants').then((res) => res.data);

export const getRestaurantDetails = (id) =>
  api.get(`/api/restaurants/${id}`).then((res) => res.data);

export const getUserProfile = (userId) =>
  api.get(`/api/auth/profile/${userId}`).then((res) => res.data);

export default api;