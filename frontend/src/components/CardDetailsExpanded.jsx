import { useRef, useEffect, useContext, useState } from "react";
import { CardSelectedContext } from "../contexts/CardSelectedContext";
import defaultBookImage from "../imgs/stock cover image.jpg";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { LendToken } from "./lendToken";

export default function CardDetailsExpanded() {

    const { id } = useParams();
    const { refetch } = useQuery;
    const [item, setItem] = useState({});
    const containerRef = useRef(null);
    const { selectedCard, setSelectedCard, registerCardRef } = useContext(CardSelectedContext);
    const [popup, setPopup] = useState(false);
    const [entryDeleted, setEntryDeleted] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [lendPopup, setLendPopup] = useState(false);
    const [returnPopup, setReturnPopup] = useState(false);
    const [itemLent, setItemLent] = useState(false);
    const [itemReturned, setItemReturned] = useState(false);

    useEffect(() => {
        const findItem = async () => {
            try {
                const response = await fetch(`https://personal-library-manager.onrender.com/details/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    (setItem(result));
                    console.log("item found successfully");
                    console.log(result);
                } else {
                    console.log("item could not be found");
                }
            } catch (error) {
                console.log(error);
            }
        }

        findItem();

    }, [id]);

    const showLendPopup = () => {
        setLendPopup(!lendPopup);
    }

    const showReturnPopup = () => {
        setReturnPopup(!returnPopup);
    }

    const showDeleteConfirm = () => {
        setPopup(!popup);
    }




    const lendItem = async (e) => {
        e.preventDefault();
        const itemToLend = selectedCard;
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
                showLendPopup(!lendPopup);
                refetch();
            } else {
                console.error("Unable to update entry", response.statusText);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const returnItem = async () => {
        const itemToReturn = { id };

        try {
            const response = await fetch("https://personal-library-manager.onrender.com/return", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(itemToReturn)
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Entry was successfully returned");
                setItemReturned(!itemReturned);
                await new Promise(resolve => setTimeout(resolve, 2000));
                showReturnPopup(!returnPopup);
                refetch();
            } else {
                console.error("Unable to update entry", response.statusText);
            }
        } catch (error) {
            console.log(error);
        }
    }

    //console.log(item.description.length);
    return (
        <div className="card-details ">
            <div className="card-details_header">
                <img src={item.coverImage !== undefined ? item.coverImage : defaultBookImage} alt="cover image" />
            </div>
            <div className="card-details_body">
                <h2>{item.title}</h2>
                <div className="card-details_body_token-wrapper">
                    <h3>{item.author}</h3>
                    {!item.isLent ? (
                        <LendToken lender="Sam" />
                    ) : null}
                </div>


                <div className="options-bar">

                    {item.isLent ? (
                        <button onClick={showReturnPopup}>Return</button>
                    ) : (
                        <button onClick={showLendPopup}>Lend</button>
                    )}
                    <button>Comment</button>
                    <button className="delete_button" onClick={showDeleteConfirm}>Delete</button>
                </div>

                <p className="description-text">{item?.description?.substring(0, 200)}</p>
            </div>
        </div>
    )
}
