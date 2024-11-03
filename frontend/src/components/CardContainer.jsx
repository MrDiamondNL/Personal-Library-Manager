import { useRef, useEffect, useContext, useState } from "react";
import { CardSelectedContext } from "../contexts/CardSelectedContext";
import defaultBookImage from "../imgs/stock cover image.jpg";
import { resolvePath, useNavigate } from "react-router-dom";

export default function CardContainer({ title, description, author, isbn, coverImage, id, lentEmail, isLent, refetch }) {
    //let defaultBookImage = "../../imgs/stock cover image.jpg"


    const containerRef = useRef(null);
    const { selectedCard, setSelectedCard, registerCardRef } = useContext(CardSelectedContext);
    const [popup, setPopup] = useState(false);
    const [entryDeleted, setEntryDeleted] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [lendPopup, setLendPopup] = useState(false);
    const [itemLent, setItemLent] = useState(false);

    const showLendPopup = () => {
        setLendPopup(!lendPopup);
    }

    const showDeleteConfirm = () => {
        setPopup(!popup);
    }


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
                setEntryDeleted(!entryDeleted);
                await new Promise(resolve => setTimeout(resolve, 2000));
                setPopup(!popup);
                refetch();

            } else {
                console.error("Unable to delete entry", response.statusText);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const lendItem = async (e) => {
        e.preventDefault();
        const itemToLend = { id };
        const formData = new FormData(e.target);
        formData.append("id", itemToLend);
        const formDataObj = Object.fromEntries(formData.entries());
        console.log(formDataObj);

        try {
            const response = await fetch("https://personal-library-manager.onrender.com/lend", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formDataObj),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Entry was successfully updated");
                setItemLent(!itemLent);
                await new Promise(resolve => setTimeout(resolve, 2000));
                setLendPopup(!lendPopup);
                refetch();
            } else {
                console.error("Unable to update entry", response.statusText);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        registerCardRef(id, containerRef.current);
    }, [id, registerCardRef]);

    const showExpanded = () => {
        setExpanded(true);
    }

    const collapseExpanded = () => {
        setExpanded(false);
    }

    return (
        <div className={`card-container ${selectedCard === id ? `container-selected` : ``} ${expanded ? `container-expanded` : ``} ${isLent ? `container-lent` : ``}`} ref={containerRef} onClick={cardSelect}>
            <img src={coverImage ?? defaultBookImage}></img>
            <div className="card-container__info">
                <h3 className="title">{title}</h3>
                <p>{author}</p>
                <p>{isbn}</p>

                {expanded ? (
                    <>
                        {isLent && (
                            <p>Item is lent to: {lentEmail}</p>
                        )}
                        <p>{description.substring(0, 400)}</p>
                    </>

                ) : (
                    <p>{description.substring(0, 40) + "..."}</p>
                )}
            </div>
            {selectedCard === id ? (
                <div className="options-bar">
                    {expanded ? (
                        <div className="expanded-options-bar">
                            <button onClick={collapseExpanded}>Collapse</button>
                            <button onClick={showLendPopup}>Lend</button>
                            <button className="delete_button" onClick={showDeleteConfirm}>Delete</button>
                        </div>

                    ) : (
                        <button onClick={showExpanded}>Expand</button>
                    )}
                    {/* <button>Lend</button>
                    <button className="delete_button" onClick={showDeleteConfirm}>Delete</button> */}
                </div>
            ) : null}

            {popup && (
                <div className="popup_window">
                    <div onClick={showDeleteConfirm} className="overlay"></div>
                    <div className="popup_content">
                        {!entryDeleted && (
                            <>
                                <h3>Delete Item</h3>
                                <p>This cannon be undone</p>
                                <div>
                                    <button onClick={showDeleteConfirm}>Cancel</button>
                                    <button className="delete_button" onClick={deleteItem}>Delete</button>
                                </div>
                            </>
                        )}
                        {entryDeleted && (
                            <p>Item Deleted Successfully</p>
                        )}
                    </div>
                </div>
            )}

            {lendPopup && (
                <div className="popup_window">
                    <div onClick={showLendPopup} className="overlay"></div>
                    <div className="popup_content">
                        {!itemLent && (
                            <>
                                <h3>Enter Lender&apos;s Email</h3>
                                <form onSubmit={lendItem}>
                                    <label htmlFor="email">Email: </label>
                                    <input type="text" id="email" name="email" required></input>
                                    <button>Submit</button>
                                </form>
                            </>
                        )}
                        {itemLent && (
                            <p>Item updated Successfully</p>
                        )}
                    </div>
                </div>
            )
            }
        </div>
    )
}
