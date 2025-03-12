import { useState } from "react";
import defaultBookImage from "../imgs/stock cover image.jpg";
import { useParams } from "react-router-dom";
import { LendToken } from "./LendToken";
import { Popup } from "./Modals/Popup";
import { IconPlus, IconTrash, IconCornerUpLeft, IconShare3 } from '@tabler/icons-react';
import { useQuery } from "react-query";
import { LoadingSpinner } from "./LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";

export default function CardDetailsExpanded() {

    const { id } = useParams();
    const CARD_DETAILS_EXPANDED_FETCH_URL = import.meta.env.VITE_BACKEND_API_URL + `details/${id}`

    const [expandedDescription, setExpandedDescription] = useState(false);
    const { getFirebaseToken } = useAuth();

    const [modalType, setModalType] = useState(null);

    const findItem = async () => {
        try {
            const idToken = await getFirebaseToken();
            const response = await fetch(CARD_DETAILS_EXPANDED_FETCH_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`
                },
                credentials: "include"
            });
            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                console.log("item could not be found");
                return null;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const { data: item, refetch } = useQuery(
        "item",
        findItem,
    )

    const showPopup = (type) => {
        setModalType(type);
    }

    const closePopup = () => {
        setModalType(null);
        refetch();
    }

    if (!item) return (
        <LoadingSpinner />
    );

    const toggleDescription = () => {
        setExpandedDescription(!expandedDescription);
    }

    return (
        <div className="card-details ">
            <div className="card-details_header">
                <img src={item.coverImage !== undefined ? item.coverImage : defaultBookImage} alt="cover image" />
            </div>
            <div className="card-details_body">
                <h2>{item.title}</h2>
                <div className="card-details_body_token-wrapper">
                    <h3 className="card-author">{item.author}</h3>
                    {item.isLent ? (
                        <LendToken lender={item.lentEmail} />
                    ) : null}
                </div>


                <div className="options-bar">

                    {item.isLent ? (
                        <button onClick={() => showPopup("return")}><IconCornerUpLeft stroke={2} />Return</button>
                    ) : (
                        <button onClick={() => showPopup("lend")}><IconShare3 stroke={2} />Lend</button>
                    )}
                    <button onClick={() => showPopup("comment")}><IconPlus stroke={2} />Comment</button>
                    <button className="delete_button" onClick={() => showPopup("delete")}><IconTrash stroke={2} />Delete</button>
                </div>

                <p className="description-text">
                    {!expandedDescription ? (
                        <>
                            {item?.description?.substring(0, 200)}{item?.description?.length > 200 ? "..." : ""}
                        </>
                    )
                        : item?.description
                    }

                </p>
                {item?.description?.length > 200 && (
                    <button className="description-button" onClick={toggleDescription}>
                        {expandedDescription ? 'Show Less' : 'Show More'}
                    </button>
                )}
                <h4>Comment Section</h4>
                <div className="comments-section">
                    {item.comments.length === 0 ? (
                        <p>No Comments Added</p>
                    ) : (
                        item.comments.toReversed().map((comment, index) => (
                            <div key={index} className="comment-entry">
                                <p className="comment-date">{new Date(comment.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })}</p>
                                <p className="comment-text">{comment.text}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {modalType && (
                <Popup
                    type={modalType}
                    item={item}
                    closePopup={closePopup}
                />
            )}
        </div>
    )
}
