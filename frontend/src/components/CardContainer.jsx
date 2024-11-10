/* eslint-disable react/prop-types */
import { useRef, useEffect, useContext, useState } from "react";
import { CardSelectedContext } from "../contexts/CardSelectedContext";
import defaultBookImage from "../imgs/stock cover image.jpg";
import { useNavigate } from "react-router-dom";
import { LendToken } from "./LendToken";

export default function CardContainer({ title, description, author, coverImage, id, lentEmail, isLent, refetch }) {
    //let defaultBookImage = "../../imgs/stock cover image.jpg"


    const containerRef = useRef(null);
    const { selectedCard, setSelectedCard, registerCardRef } = useContext(CardSelectedContext);
    const navigate = useNavigate();


    const cardSelect = (event) => {
        event.stopPropagation();
        if (selectedCard !== id) {
            setSelectedCard(id);
        }
        navigateToItem();
    }

    const navigateToItem = () => {
        navigate(`/details/${id}`);
    }

    useEffect(() => {
        registerCardRef(id, containerRef.current);
    }, [id, registerCardRef]);



    return (
        <div className={`card-container ${selectedCard === id ? `container-selected` : ``} `} ref={containerRef} onClick={cardSelect}>
            <img src={coverImage ?? defaultBookImage}></img>
            <div className="card-container__info">
                <h3 className="title">{title}</h3>
                <div className="card-details_body_token-wrapper">
                    <h3>{author}</h3>
                    {isLent ? (
                        <LendToken lender={lentEmail} />
                    ) : null}
                </div>
                <p>{description.substring(0, 40) + "..."}</p>

            </div>
        </div>
    )
}
