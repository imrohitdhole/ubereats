// src/redux/hooks.js
import { useDispatch, useSelector } from 'react-redux';

// Use these custom hooks throughout your app instead of importing from react-redux directly
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;