/* eslint-disable react/prop-types */
import { useRef, useEffect, useContext } from "react";
import { CardSelectedContext } from "../contexts/CardSelectedContext";
import defaultBookImage from "../imgs/stock cover image.jpg";
import { useNavigate } from "react-router-dom";
import { LendToken } from "./LendToken";

export default function CardContainer({ title, description, author, coverImage, id, lentEmail, isLent }) {


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
        if (id == "23453453453") {
            navigate("/example_entry");
        } else {
            navigate(`/details/${id}`);
        }


    }

    useEffect(() => {
        registerCardRef(id, containerRef.current);
    }, [id, registerCardRef]);



    return (
        <div className={`card-container`} ref={containerRef} onClick={cardSelect}>
            <div className="cover-img-wrapper">
                <img src={coverImage ?? defaultBookImage}></img>
            </div>

            <div className="card-container__info">
                <h3 className="title">{title}</h3>
                <div className="card-details_body_token-wrapper">
                    <h3 className="card-author">{author}</h3>
                </div>
                <p>{description.substring(0, 80)}{description.length > 80 ? "..." : ""}</p>

                {isLent ? (
                    <LendToken lender={lentEmail} />
                ) : null}
            </div>
        </div>
    )
}
