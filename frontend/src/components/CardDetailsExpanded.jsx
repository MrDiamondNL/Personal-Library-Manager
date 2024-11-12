import { useEffect, useState } from "react";
import defaultBookImage from "../imgs/stock cover image.jpg";
import { useParams } from "react-router-dom";
import { LendToken } from "./LendToken";
import { Popup } from "./Modals/Popup";
import { IconPlus, IconTrash, IconCornerUpRight, IconCornerUpLeft, IconShare3 } from '@tabler/icons-react';
import { useQuery } from "react-query";

export default function CardDetailsExpanded() {

    const { id } = useParams();
    const [expandedDescription, setExpandedDescription] = useState(false);

    const [modalType, setModalType] = useState(null);

    const findItem = async () => {
        try {
            const response = await fetch(`https://personal-library-manager.onrender.com/details/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(response);
            if (response.ok) {
                const result = await response.json();
                console.log("item found successfully");
                console.log(result);
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
        <div>Loading...</div>
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
                    <h3>{item.author}</h3>
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