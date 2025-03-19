/* eslint-disable react/prop-types */
import { useState, useContext } from 'react'
import { CustomFetchContext } from "../contexts/CustomFetchContext";

export const ReturnPopup = ({ item, closePopup }) => {
    const [itemReturned, setItemReturned] = useState(false);
    const { customFetch } = useContext(CustomFetchContext);

    const returnItem = async () => {
        const itemToReturn = item._id;
        const LIBRARY_ITEM_RETURN_URL = import.meta.env.VITE_BACKEND_API_URL + "api/return";

        try {
            const response = await customFetch(LIBRARY_ITEM_RETURN_URL, {
                method: "PUT",
                body: JSON.stringify({ id: itemToReturn })
            });
            console.log("Entry was successfully returned");
            setItemReturned(!itemReturned);
            await new Promise(resolve => setTimeout(resolve, 2000));
            closePopup();

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {!itemReturned &&
                <>
                    <h3>Return Item From</h3>
                    <p>{item.lentEmail}</p>
                    <button onClick={returnItem}>Confirm</button>
                </>
            }
            {itemReturned &&
                <p>Item Successfully Returned</p>
            }
        </div>
    )
}
