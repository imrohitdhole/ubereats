import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDate, closeModal } from "../redux/slices/scheduleSlice";

const ScheduleModal = () => {
    const dispatch = useDispatch();
    const { isOpen, selectedDate } = useSelector((state) => state.schedule);

    if (!isOpen) return null;

    const getNext7Days = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const futureDate = new Date();
            futureDate.setDate(today.getDate() + i);

            const options = { weekday: "short", month: "short", day: "numeric" };
            const formattedDate = futureDate.toLocaleDateString("en-US", options);

            dates.push(formattedDate);
        }
        return dates;
    };

    const handleDateChange = (e) => {
        dispatch(selectDate(e.target.value));
    };

    const handleClose = () => {
        dispatch(closeModal());
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white text-black p-8 rounded-lg shadow-xl w-[500px] md:w-[600px]">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">Pick a time</h2>
                    <button className="text-3xl font-bold" onClick={handleClose}>
                        ✖
                    </button>
                </div>

                {/* Date Selector */}
                <select
                    className="block w-full mt-6 p-4 border border-gray-300 rounded-lg text-lg"
                    value={selectedDate}
                    onChange={handleDateChange}
                >
                    {getNext7Days().map((date, index) => (
                        <option key={index} value={date}>
                            {index === 0 ? `Today, ${date}` : date}
                        </option>
                    ))}
                </select>

                {/* Time Selector */}
                <select className="block w-full mt-4 p-4 border border-gray-300 rounded-lg text-lg">
                    <option>11:00 PM - 11:30 PM</option>
                    <option>11:30 PM - 12:00 AM</option>
                    <option>12:00 AM - 12:30 AM</option>
                </select>

                {/* Buttons */}
                <div className="flex flex-col mt-6 items-start">
                    <button className="w-full bg-black text-white p-5 rounded-lg font-semibold text-lg shadow-md">
                        Schedule
                    </button>
                    <button
                        className="w-full mt-3 bg-gray-200 text-black p-5 rounded-lg font-semibold text-lg shadow-md"
                        onClick={handleClose}
                    >
                        Deliver now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleModal;