import { createContext, useContext, useEffect, useState, useRef } from 'react'

export const CardSelectedContext = createContext();

export const CardSelectedProvider = ({ cards }) => {

    const cardRef = useRef([]);
    const [selectedCard, setSelectedCard] = useState(null);

    // const addOutsideSelectedListener = (event) => {
    //     if (containerRef.current && !containerRef.current.contains(event.target)) {
    //         document.addEventListener("mousedown", handleClickOutsideSelected);
    //     }

    // }

    const handleClickOutsideSelected = (event) => {
        if (selectedCard !== null && !cardRef.current[selectedCard]?.contains(event.target)) {
            setCardSelected(null);
        }
    }

    useEffect(() => {
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
            {cards}
        </CardSelectedContext.Provider>
    );
};
