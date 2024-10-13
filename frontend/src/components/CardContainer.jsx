import { useRef, useEffect, useContext, useState } from "react";
import { CardSelectedContext } from "../contexts/CardSelectedContext";

export default function CardContainer({ title, description, author, isbn, coverImage, id }) {
    let defaultBookImage = "../imgs/stock cover image.jpg";

    //const [cardSelected, setCardSelected] = useState(false);
    const containerRef = useRef(null);
    const { selectedCard, setSelectedCard, registerCardRef } = useContext(CardSelectedContext);
    //const [deleteId, setDeleteId] = useState();

    const cardSelect = (event) => {
        event.stopPropagation();
        if (selectedCard !== id) {
            setSelectedCard(id);
        }
    }

    const deleteItem = async () => {
        const itemToDelete = { id };
        console.log(id);
        console.log(itemToDelete);

        try {
            const response = await fetch("https://personal-library-manager.onrender.com/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(itemToDelete),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Entry was successfully deleted");
            } else {
                console.error("Unable to delete entry", response.statusText);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        registerCardRef(id, containerRef.current);
    }, [id, registerCardRef]);

    return (
        <div className={`card-container ${selectedCard === id ? `container-selected` : ``}`} ref={containerRef} onClick={cardSelect}>
            <img src={coverImage !== undefined ? coverImage : defaultBookImage}></img>
            <div className="card-container__info">
                <h3 className="title">{title}</h3>
                <p>{author}</p>
                <p>{isbn}</p>
                <p>{description.substring(0, 40) + "..."}</p>
            </div>
            {selectedCard === id ? (
                <div className="options-bar">
                    <button>Lend</button>
                    <button onClick={deleteItem}>Delete</button>
                </div>
            ) : null}
        </div>
    )
}
