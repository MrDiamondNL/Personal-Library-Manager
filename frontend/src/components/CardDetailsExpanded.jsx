import { useRef, useEffect, useContext, useState } from "react";
import { CardSelectedContext } from "../contexts/CardSelectedContext";
import defaultBookImage from "../imgs/stock cover image.jpg";

export default function CardDetailsExpanded({ title, description, author, isbn, coverImage, id, lentEmail, isLent, refetch }) {

    const containerRef = useRef(null);
    const { selectedCard, setSelectedCard, registerCardRef } = useContext(CardSelectedContext);
    const [popup, setPopup] = useState(false);
    const [entryDeleted, setEntryDeleted] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [lendPopup, setLendPopup] = useState(false);
    const [returnPopup, setReturnPopup] = useState(false);
    const [itemLent, setItemLent] = useState(false);
    const [itemReturned, setItemReturned] = useState(false);


    return (
        <div>CardDetailsExpanded</div>
    )
}
