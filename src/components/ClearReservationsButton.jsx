import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../config/axiosConfig';

const ClearReservationsButton = () => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleClearReservations = async () => {
        try {
            await api.delete('/reservations/all');
            toast.success('All reservations have been cleared');
            setIsConfirmOpen(false);
        } catch (error) {
            toast.error(error.response?.data || 'Failed to clear reservations');
        }
    };

    if (isConfirmOpen) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-red-600">Are you sure?</span>
                <button
                    onClick={handleClearReservations}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Yes, Clear All
                </button>
                <button
                    onClick={() => setIsConfirmOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsConfirmOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
            <Trash2 size={20} />
            Clear All Reservations
        </button>
    );
};

export default ClearReservationsButton;