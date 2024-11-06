import { useRef, useEffect, useContext, useState } from "react";
import { CardSelectedContext } from "../contexts/CardSelectedContext";
import defaultBookImage from "../imgs/stock cover image.jpg";
import { useParams } from "react-router-dom";

export default function CardDetailsExpanded() {

    const { id } = useParams();
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
                    setItem(result);
                    console.log("item found successfully");
                } else {
                    console.log("item could not be found");
                }
            } catch (error) {
                console.log(error);
            }
        }

        findItem();
    }, [id]);


    return (
        <div className="card-details ">
            <div className="card-details_header">
                <img src={item.coverImage !== undefined ? item.coverImage : defaultBookImage} alt="cover image" />
                <div className="card-details_header-sidebar">
                    <h2>{item.title}</h2>
                    <h3>{item.author}</h3>
                    <p>ISBN: {item.isbn}</p>
                </div>
            </div>
            <div className="card-details_body">
                <p>{item.description}</p>
            </div>
        </div>
    )
}
