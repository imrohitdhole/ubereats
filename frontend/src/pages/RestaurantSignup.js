import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../redux/hooks";
import { registerRestaurant } from "../redux/slices/restaurantSlice";
import { showToast } from "../redux/slices/uiSlice";

const RestaurantSignup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [restaurantImage, setRestaurantImage] = useState(null);
  const dispatch = useAppDispatch();

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    if (restaurantImage) formData.append('image', restaurantImage);

    try {
      await dispatch(registerRestaurant(formData)).unwrap();
      dispatch(showToast({ message: "Restaurant registered successfully!", type: "success" }));
      navigate("/restaurant-login");
    } catch (err) {
      dispatch(showToast({ message: err.message || "Registration failed.", type: "error" }));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Restaurant Name" />
      <input {...register('email')} placeholder="Email" />
      <input {...register('password')} type="password" placeholder="Password" />
      <input type="file" onChange={(e) => setRestaurantImage(e.target.files[0])} />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default RestaurantSignup;