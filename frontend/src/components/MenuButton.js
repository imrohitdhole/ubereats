import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { openMenu } from "../redux/slices/menuSlice";

const MenuButton = () => {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(openMenu())}
      className="text-gray-700 hover:text-green-600 focus:outline-none transition-colors"
      aria-label="Open menu"
    >
      <FontAwesomeIcon icon={faBars} className="text-2xl" />
    </button>
  );
};

export default MenuButton;