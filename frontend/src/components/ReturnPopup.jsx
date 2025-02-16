/* eslint-disable react/prop-types */
import { useState } from 'react'

export const ReturnPopup = ({ item, closePopup }) => {
    const [itemReturned, setItemReturned] = useState(false);

    const returnItem = async () => {
        const itemToReturn = item._id;

        try {
            const response = await fetch("https://personal-library-manager.onrender.com/return", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: itemToReturn })
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Entry was successfully returned");
                setItemReturned(!itemReturned);
                await new Promise(resolve => setTimeout(resolve, 2000));
                closePopup();
            } else {
                console.error("Unable to update entry", response.statusText);
            }
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
