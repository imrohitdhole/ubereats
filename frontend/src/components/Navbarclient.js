import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faShoppingCart, faBicycle, faHouse, faLocationDot, faTimes } from "@fortawesome/free-solid-svg-icons";
import Hamburgermenu from "./Hamburgermenu";
import { Link } from "react-router-dom";
import Autocomplete from "react-google-autocomplete";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setDeliveryMode, setLocation, setSearchTerm } from "../redux/slices/appSlice";
import { toggleLocationModal } from "../redux/slices/uiSlice";
import { setGoogleMapsApiKey } from '../redux/slices/appSlice';


const Navbar = () => {
  const dispatch = useAppDispatch();
  const { deliveryMode, selectedLocation, searchTerm } = useAppSelector((state) => state.app);
  const { isLocationModalOpen } = useAppSelector((state) => state.ui);
  const { items } = useAppSelector((state) => state.cart);
  const { googleMapsApiKey } = useAppSelector((state) => state.app);
  
  const autocompleteRef = useRef(null);
  const cartItemsCount = items.length;

  useEffect(() => {
    const fetchGoogleMapsKey = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/google-maps-key");
        const data = await res.json();
        if (data.apiKey) {
          dispatch(setGoogleMapsApiKey(data.apiKey));
        }
      } catch (error) {
        console.error("Error fetching Google Maps API Key:", error);
      }
    };
    fetchGoogleMapsKey();
  }, [dispatch]);

  const handleDeliveryModeChange = (mode) => {
    dispatch(setDeliveryMode(mode));
  };

  const handleLocationSelect = (place) => {
    dispatch(setLocation({
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    }));
    dispatch(toggleLocationModal());
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left Section - Logo and Hamburger */}
        <div className="flex items-center space-x-4">
          <Hamburgermenu />
          <Link to="/" className="text-2xl font-bold">
            Uber<span className="text-green-600">Eats</span>
          </Link>
        </div>

        {/* Center Section - Delivery/Pickup Toggle */}
        <div className="hidden md:flex items-center space-x-2 border border-gray-300 rounded-full p-1">
          <button
            className={`px-4 py-1 rounded-full ${
              deliveryMode === 'delivery'
                ? 'bg-black text-white'
                : 'bg-white text-black'
            }`}
            onClick={() => handleDeliveryModeChange('delivery')}
          >
            <FontAwesomeIcon icon={faBicycle} className="mr-2" />
            Delivery
          </button>
          <button
            className={`px-4 py-1 rounded-full ${
              deliveryMode === 'pickup'
                ? 'bg-black text-white'
                : 'bg-white text-black'
            }`}
            onClick={() => handleDeliveryModeChange('pickup')}
          >
            <FontAwesomeIcon icon={faHouse} className="mr-2" />
            Pickup
          </button>
        </div>

        {/* Right Section - Location, Search, Cart */}
        <div className="flex items-center space-x-4">
          {/* Location Button */}
          <button
            className="flex items-center text-gray-700 hover:text-black"
            onClick={() => dispatch(toggleLocationModal())}
          >
            <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
            <span className="hidden sm:inline-block">
              {selectedLocation?.address || "Select Location"}
            </span>
          </button>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search restaurants or dishes"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-64"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-3 text-gray-400"
            />
          </div>

          {/* Cart Link */}
          <Link to="/cart" className="relative">
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="text-xl text-gray-700 hover:text-black"
            />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemsCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select Location</h2>
              <button onClick={() => dispatch(toggleLocationModal())}>
                <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
              </button>
            </div>
            {googleMapsApiKey ? (
              <Autocomplete
                apiKey={googleMapsApiKey}
                onPlaceSelected={handleLocationSelect}
                options={{
                  types: ["geocode", "establishment"],
                }}
                className="w-full p-2 border border-gray-300 rounded"
                ref={autocompleteRef}
                defaultValue={selectedLocation?.address || ""}
              />
            ) : (
              <div className="text-gray-500">Loading map...</div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
                onClick={() => dispatch(toggleLocationModal())}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;