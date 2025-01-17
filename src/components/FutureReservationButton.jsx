import React from 'react';
import { CalendarPlus } from 'lucide-react';
import PropTypes from "prop-types";

const FutureReservationButton = ({ onClick }) => {
    return (
        <div className="w-full flex justify-center mb-4">
            <button
                onClick={onClick}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
            >
                <CalendarPlus size={20} />
                Make Future Reservation
            </button>
        </div>
    );
};
FutureReservationButton.propTypes = {
    onClick: PropTypes.func.isRequired,
}
export default FutureReservationButton;