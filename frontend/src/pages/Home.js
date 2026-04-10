import React, { useState, useEffect, useRef } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import ScheduleModal from "../components/ScheduleModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faClock, faCalendarAlt, faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import SidebarBeforeLogin from "../components/Hamburgerbeforelogin"; 
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);  
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [deliveryOption, setDeliveryOption] = useState("Deliver now");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [address, setAddress] = useState("");
    const [googleMapsApiKey, setGoogleMapsApiKey] = useState(null);
    const autocompleteRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5001/api/google-maps-key")
            .then(res => res.json())
            .then(data => {
                if (data.apiKey) {
                    setGoogleMapsApiKey(data.apiKey);
                } else {
                    console.error("API Key not found in response:", data);
                }
            })
            .catch(error => console.error("Error fetching Google Maps API Key:", error));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            {/* Sidebar */}
            {isSidebarOpen && <SidebarBeforeLogin onClose={() => setIsSidebarOpen(false)} />}
    
            {/* Modern Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 w-full fixed top-0 left-0 z-50 bg-white shadow-md">
                <div className="flex items-center space-x-4">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-700 hover:text-green-600 transition text-2xl">
                        <FontAwesomeIcon icon={faBars} />
                    </button>
    
                    <a href="/" className="text-2xl flex items-center space-x-1 font-semibold">
                        <span className="text-gray-900">Uber</span> 
                        <span className="font-bold text-green-600">Eats</span>
                    </a>
                </div>
    
                <div className="flex items-center space-x-3">
                    <a href="/login" className="px-5 py-2 text-gray-700 hover:text-gray-900 transition duration-300 font-medium">
                        Log in
                    </a>
                    <a href="/signup" className="px-5 py-2 bg-green-600 text-white rounded-lg transition duration-300 hover:bg-green-700 font-medium">
                        Sign up
                    </a>
                </div>
            </nav>
    
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center flex-grow pt-24 px-6">
                <div className="max-w-5xl w-full flex flex-col md:flex-row gap-10 items-center">
                    {/* Left Side Content */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Delicious food, <br/>
                            <span className="text-green-600">delivered to your door</span>
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Order from your favorite restaurants and track your delivery in real-time.
                        </p>
                        
                        {googleMapsApiKey ? (
                            <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
                                <div className="space-y-4">
                                    <div className="flex items-center bg-white p-3 shadow-lg rounded-xl border border-gray-200">
                                        <span className="text-green-600 px-2 text-xl">
                                            <FontAwesomeIcon icon={faLocationDot} />
                                        </span>
                                        <Autocomplete
                                            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                                            onPlaceChanged={() => {
                                                const place = autocompleteRef.current.getPlace();
                                                if (place && place.formatted_address) {
                                                    setAddress(place.formatted_address);
                                                }
                                            }}
                                        >
                                            <input
                                                type="text"
                                                placeholder="Enter delivery address"
                                                className="p-2 flex-grow text-gray-800 outline-none text-lg"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                            />
                                        </Autocomplete>
                                    </div>
        
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative">
                                            <button
                                                className="flex items-center w-full justify-between sm:w-56 bg-white px-4 py-3 text-gray-700 font-medium rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition"
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            >
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faClock} className="mr-2 text-green-600" />
                                                    <span>{deliveryOption}</span>
                                                </div>
                                                <span>▼</span>
                                            </button>
        
                                            {isDropdownOpen && (
                                                <div className="absolute bg-white shadow-lg mt-2 w-full rounded-xl z-10 border border-gray-200">
                                                    <button
                                                        className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 flex items-center border-b border-gray-100"
                                                        onClick={() => {
                                                            setDeliveryOption("Deliver now");
                                                            setIsDropdownOpen(false);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faClock} className="mr-2 text-green-600" />
                                                        Deliver now
                                                    </button>
                                                    <button
                                                        className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 flex items-center"
                                                        onClick={() => {
                                                            setDeliveryOption("Schedule for later");
                                                            setIsDropdownOpen(false);
                                                            setIsModalOpen(true);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-green-600" />
                                                        Schedule for later
                                                    </button>
                                                </div>
                                            )}
                                        </div>
        
                                        <button 
                                            className="bg-green-600 w-full sm:w-56 py-3 px-4 text-white font-medium rounded-xl shadow-md flex items-center justify-center gap-2 transition hover:bg-green-700" 
                                            onClick={() => navigate("/login")}
                                        >
                                            <FontAwesomeIcon icon={faSearch} />
                                            Find Food
                                        </button>
                                    </div>
                                </div>
                            </LoadScript>
                        ) : (
                            <p className="text-lg text-gray-600">Loading Maps...</p>
                        )}
                        
                        <p className="text-gray-600">
                            <span>Already have an account? </span>
                            <a href="/login" className="text-green-600 font-medium hover:underline">Sign in</a>
                        </p>
                    </div>
                    
                    {/* Right Side Image */}
                    <div className="w-full md:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-md h-96 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-uber-home bg-cover bg-center"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <p className="text-white text-xl font-bold">Hungry?</p>
                                <p className="text-gray-200">Order your favorite meals now!</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Feature Section */}
                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faLocationDot} className="text-green-600 text-xl" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Local Favorites</h3>
                        <p className="text-gray-600">Discover restaurants and cuisines in your neighborhood</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faClock} className="text-green-600 text-xl" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Fast Delivery</h3>
                        <p className="text-gray-600">Get your food delivered quickly, right to your doorstep</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-green-600 text-xl" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Schedule Orders</h3>
                        <p className="text-gray-600">Plan ahead by scheduling your meals for later</p>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <footer className="bg-gray-800 text-gray-300 py-8 px-6">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="text-xl font-semibold">Uber</span>
                        <span className="text-xl font-bold text-green-500">Eats</span>
                    </div>
                    {/* <div className="flex gap-6">
                        <a href="#" className="hover:text-white">About</a>
                        <a href="#" className="hover:text-white">Restaurants</a>
                        <a href="#" className="hover:text-white">Delivery</a>
                        <a href="#" className="hover:text-white">Help</a>
                    </div> */}
                </div>
            </footer>
    
            <ScheduleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );    
};

export default Home;