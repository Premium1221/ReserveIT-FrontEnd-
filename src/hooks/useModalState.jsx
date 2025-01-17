import { useState } from 'react';

const useModalState = () => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        selectedRestaurant: null
    });

    const handleModalOpen = (restaurant) => {
        setModalState({
            isOpen: true,
            selectedRestaurant: restaurant
        });
    };

    const handleModalClose = () => {
        setModalState({
            isOpen: false,
            selectedRestaurant: null
        });
    };

    return {
        modalState,
        handleModalOpen,
        handleModalClose
    };
};

export default useModalState;