/* eslint-disable react/prop-types */
import { createContext, useEffect, useState, useRef } from 'react'

export const CardSelectedContext = createContext();

export const CardSelectedProvider = ({ children }) => {

    const cardRef = useRef([]);
    const [selectedCard, setSelectedCard] = useState(null);


    useEffect(() => {
        const handleClickOutsideSelected = (event) => {
            if (selectedCard !== null && !cardRef.current[selectedCard]?.contains(event.target)) {
                setSelectedCard(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutsideSelected);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideSelected);
        }
    }, [selectedCard]);

    const registerCardRef = (index, ref) => {
        cardRef.current[index] = ref;
    }

    return (
        <CardSelectedContext.Provider value={{ selectedCard, setSelectedCard, registerCardRef }}>
            {children}
        </CardSelectedContext.Provider>
    );
};
