import React from "react";

const RatingFilters = ({ sortOrder, setSortOrder }) => {
  return (
    <div className="flex justify-start space-x-3 mt-4 ml-4">
      <button
        className={`px-4 py-2 rounded-full border ${sortOrder === "low-to-high" ? "bg-gray-300 text-black" : "bg-gray-100 text-gray-700"}`}
        onClick={() => setSortOrder("low-to-high")}
      >
        Rating: Low to High
      </button>
      <button
        className={`px-4 py-2 rounded-full border ${sortOrder === "high-to-low" ? "bg-gray-300 text-black" : "bg-gray-100 text-gray-700"}`}
        onClick={() => setSortOrder("high-to-low")}
      >
        Rating: High to Low
      </button>
      <button
        className="px-4 py-2 rounded-full bg-gray-400 text-white hover:bg-gray-500"
        onClick={() => setSortOrder("")}
      >
        Reset
      </button>
    </div>
  );
};

export default RatingFilters;
