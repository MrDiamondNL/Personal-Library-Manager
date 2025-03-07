/* eslint-disable react/prop-types */
import { useState } from 'react'

export const LendPopup = ({ item, closePopup }) => {
    const [itemLent, setItemLent] = useState(false);

    const lendItem = async (e) => {
        e.preventDefault();
        const itemToLend = item._id;
        const formData = new FormData(e.target);
        formData.append("id", itemToLend);
        const formDataObj = Object.fromEntries(formData.entries());
        const LIBRARY_ITEM_LEND_URL = import.meta.env.VITE_BACKEND_API_URL + "lend";
        try {
            const response = await fetch(LIBRARY_ITEM_LEND_URL, {
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
            {!itemLent && (
                <>
                    <h3>Enter Recipient</h3>
                    <form onSubmit={lendItem}>
                        <label htmlFor="email">Contact: </label>
                        <input type="text" id="email" name="email" required></input>
                        <button>Submit</button>
                    </form>
                </>
            )}
            {itemLent && (
                <p>Item updated Successfully</p>
            )}
        </div>
    )
}
