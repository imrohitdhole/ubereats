import React from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { clearToast } from '../redux/slices/uiSlice';

const Toast = () => {
  const dispatch = useAppDispatch();
  const { toast } = useAppSelector((state) => state.ui);

  if (!toast) return null;

  const handleClose = () => {
    dispatch(clearToast());
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
      <p>{toast.message}</p>
      <button onClick={handleClose} className="ml-4 text-white">✕</button>
    </div>
  );
};

export default Toast;