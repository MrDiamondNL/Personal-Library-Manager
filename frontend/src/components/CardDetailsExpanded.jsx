import { useEffect, useState } from "react";
import defaultBookImage from "../imgs/stock cover image.jpg";
import { useParams } from "react-router-dom";
import { LendToken } from "./lendToken";
import { Popup } from "./Modals/Popup";

export default function CardDetailsExpanded() {

    const { id } = useParams();
    const [item, setItem] = useState({});


    const [modalType, setModalType] = useState(null);

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

    const showPopup = (type) => {
        setModalType(type);
    }

    const closePopup = () => {
        setModalType(null);
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
                        <button onClick={() => showPopup("return")}>Return</button>
                    ) : (
                        <button onClick={() => showPopup("lend")}>Lend</button>
                    )}
                    <button onClick={() => showPopup("comment")}>Comment</button>
                    <button className="delete_button" onClick={() => showPopup("delete")}>Delete</button>
                </div>

                <p className="description-text">{item?.description?.substring(0, 200)}</p>
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
