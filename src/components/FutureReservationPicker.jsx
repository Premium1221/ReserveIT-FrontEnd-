// FutureReservationPicker.jsx
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const FutureReservationPicker = ({ onTimeSelect }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedDate && selectedTime) {
            const dateTime = `${selectedDate}T${selectedTime}:00`;
            onTimeSelect(dateTime);
        }
    };

    // Generate time slots between 11:00 and 22:00
    const timeSlots = [];
    for (let hour = 11; hour <= 23; hour++) {
        timeSlots.push(`${String(hour).padStart(2, '0')}:00`);
        timeSlots.push(`${String(hour).padStart(2, '0')}:30`);
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pick a Date</label>
                    <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm p-2"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pick a Time</label>
                    <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm p-2"
                        required
                    >
                        <option value="">Choose time</option>
                        {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                >
                    <Calendar size={20} />
                    Show Available Tables
                </button>
            </form>
        </div>
    );
};

export default FutureReservationPicker;