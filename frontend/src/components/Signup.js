// Signup.js — converted to dispatch signup via redux
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/slices/authSlice";

const Signup = () => {
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user.password.length < 6) {
            setMessage("Password must be at least 6 characters long.");
            return;
        }

        dispatch(signupUser({ user, navigate, setMessage }));
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-3xl font-bold text-green-600 text-center mb-6">User Signup</h2>
            {message && <p className="text-red-500 text-center mb-2">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-green-500" />
                <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-green-500" />
                <input type="password" name="password" placeholder="Password (Min. 6 characters)" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-green-500" />
                <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-600">Register</button>
            </form>
            <p className="text-center text-gray-600 mt-4">
                Already have an account? <Link to="/login" className="text-green-600 font-bold">Login</Link>
            </p>
        </div>
    );
};

export default Signup;
