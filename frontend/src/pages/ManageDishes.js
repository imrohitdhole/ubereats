import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import HamburgerMenu from "../components/Hamburgermenu";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchDishes, addDish, updateDish, deleteDish } from "../redux/slices/menuSlice";
import { showToast } from "../redux/slices/uiSlice";

const ManageDishes = () => {
  const { restaurantId } = useParams();
  const dispatch = useAppDispatch();
  const { dishes, isLoading, error } = useAppSelector((state) => state.menu);
  const [newDish, setNewDish] = useState({
    name: "",
    main_ingredient: "",
    price: "",
    category: "Appetizer",
    description: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDishId, setEditDishId] = useState(null);

  useEffect(() => {
    if (restaurantId && restaurantId !== "null") {
      dispatch(fetchDishes(restaurantId));
    } else {
      dispatch(showToast({ message: "Error: Restaurant ID is missing!", type: "error" }));
    }
  }, [dispatch, restaurantId]);

  const handleChange = (e) => {
    setNewDish({ ...newDish, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleEditDish = (dish) => {
    setEditMode(true);
    setEditDishId(dish.id);
    setNewDish({
      name: dish.name,
      main_ingredient: dish.main_ingredient,
      price: dish.price,
      category: dish.category,
      description: dish.description || "",
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditDishId(null);
    setNewDish({
      name: "",
      main_ingredient: "",
      price: "",
      category: "Appetizer",
      description: "",
    });
    setSelectedImage(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurantId || restaurantId === "null") {
      dispatch(showToast({ message: "Error: Restaurant ID is missing!", type: "error" }));
      return;
    }

    const dishData = { ...newDish, restaurantId };
    if (selectedImage) {
      dishData.image = selectedImage;
    }

    try {
      if (editMode) {
        await dispatch(updateDish({ restaurantId, dishId: editDishId, dishData })).unwrap();
        dispatch(showToast({ message: "Dish updated successfully!", type: "success" }));
      } else {
        await dispatch(addDish(dishData)).unwrap();
        dispatch(showToast({ message: "Dish added successfully!", type: "success" }));
      }
      setNewDish({
        name: "",
        main_ingredient: "",
        price: "",
        category: "Appetizer",
        description: "",
      });
      setSelectedImage(null);
      setEditMode(false);
      setEditDishId(null);
      setShowForm(false);
    } catch (err) {
      dispatch(showToast({ message: err.message || "Error processing dish.", type: "error" }));
    }
  };

  const handleDeleteDish = async (dishId) => {
    try {
      await dispatch(deleteDish({ restaurantId, dishId })).unwrap();
      dispatch(showToast({ message: "Dish deleted successfully!", type: "success" }));
    } catch (err) {
      dispatch(showToast({ message: err.message || "Error deleting dish.", type: "error" }));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-white shadow-lg py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-x-4">
          <HamburgerMenu />
          <a href="/" className="text-2xl text-black font-bold">Uber Eats</a>
        </div>
        <div className="flex space-x-4 items-center">
          <Link to="/restaurant-dashboard" className="px-4 py-2 text-red-500 font-medium hover:text-red-700 hover:underline">Back</Link>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Dishes</h1>
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)} 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
            >
              Add New Dish
            </button>
          )}
        </div>
        {error && (
          <div className="p-4 mb-6 rounded-lg bg-red-100 text-red-700">
            {error}
          </div>
        )}
        {showForm && (
          <div className="bg-white p-6 shadow-md rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {editMode ? "Edit Dish" : "Add New Dish"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dish Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={newDish.name} 
                    onChange={handleChange} 
                    className="border border-gray-300 p-2 rounded-lg w-full text-black focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" 
                    placeholder="Enter dish name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                  <input 
                    type="text" 
                    name="main_ingredient" 
                    required 
                    value={newDish.main_ingredient} 
                    onChange={handleChange} 
                    className="border border-gray-300 p-2 rounded-lg w-full text-black focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" 
                    placeholder="Enter ingredients" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    name="price" 
                    required 
                    value={newDish.price} 
                    onChange={handleChange} 
                    className="border border-gray-300 p-2 rounded-lg w-full text-black focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" 
                    placeholder="Enter price" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={newDish.description} 
                  onChange={handleChange} 
                  className="border border-gray-300 p-2 rounded-lg w-full text-black focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Enter dish description" 
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    name="category" 
                    value={newDish.category} 
                    onChange={handleChange} 
                    className="border border-gray-300 p-2 rounded-lg w-full text-black focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="Appetizer">Appetizer</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {editMode ? "Update Dish Image (optional)" : "Dish Image"}
                  </label>
                  <input 
                    type="file" 
                    onChange={handleImageChange} 
                    className="border border-gray-300 p-2 rounded-lg w-full text-black" 
                  />
                  {editMode && (
                    <p className="text-xs text-gray-500 mt-1">Leave empty to keep the current image</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={cancelEdit} 
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                >
                  {isLoading ? "Processing..." : editMode ? "Update Dish" : "Save Dish"}
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">Your Dishes</h2>
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              <p>Loading dishes...</p>
            </div>
          ) : dishes.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No dishes available. Add your first dish!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishes.map((dish) => (
                <div key={dish.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  {dish.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={`${dish.image}`} 
                        alt={dish.name} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{dish.name}</h3>
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-1">{dish.category}</span>
                      </div>
                      <p className="font-semibold text-lg text-green-600">${dish.price}</p>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm">{dish.main_ingredient}</p>
                    {dish.description && (
                      <p className="text-gray-700 mt-3 text-sm border-t pt-2">{dish.description}</p>
                    )}
                    <div className="mt-4 flex justify-end space-x-4">
                      <button 
                        onClick={() => handleEditDish(dish)} 
                        className="text-blue-500 hover:text-blue-700 font-medium text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteDish(dish.id)} 
                        className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDishes;