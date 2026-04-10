import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector, useDispatch } from "react-redux";
import { setFilters } from "../redux/slices/restaurantSlice";

const CATEGORIES = [
  { name: "Burger", icon: "🍔" },
  { name: "Caribbean", icon: "🥘" },
  { name: "Drinks", icon: "🥤" },
  { name: "Fast Food", icon: "🍟" },
  { name: "Grocery", icon: "🛍️" },
  { name: "Dessert", icon: "🍨" },
  { name: "Japanese", icon: "🍜" },
  { name: "Italian", icon: "🍝" },
  { name: "Box Catering", icon: "🥡" },
  { name: "Seafood", icon: "🦐" },
  { name: "Sushi", icon: "🍣" },
  { name: "Alcohol", icon: "🍷" },
  { name: "Wings", icon: "🍗" },
];

const CategoryCarousel = () => {
  const selectedCategory = useSelector((state) => state.restaurant.filters.category);
  const dispatch = useDispatch();
  
  const handleCategorySelect = (categoryName) => {
    dispatch(setFilters({ category: categoryName }));
  };

  return (
    <div className="p-6 mt-20 relative">
      <Slider dots={false} infinite={true} speed={500} slidesToShow={10} slidesToScroll={2}>
        {CATEGORIES.map((category, index) => (
          <div key={index} className="text-center cursor-pointer">
            <div 
              className={`text-3xl ${selectedCategory === category.name ? "font-bold text-black" : "text-gray-500"}`} 
              onClick={() => handleCategorySelect(category.name)}
            >
              {category.icon}
            </div>
            <p className={`mt-2 ${selectedCategory === category.name ? "font-bold text-black" : "text-gray-600"}`}>
              {category.name}
            </p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CategoryCarousel;