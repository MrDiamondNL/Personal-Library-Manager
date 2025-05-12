/* eslint-disable react/prop-types */
import { useState, useContext } from 'react'
import { CustomFetchContext } from "../contexts/CustomFetchContext";

export const LendPopup = ({ item, closePopup }) => {
    const [itemLent, setItemLent] = useState(false);
    const { customFetch } = useContext(CustomFetchContext);

    const lendItem = async (e) => {
        e.preventDefault();
        const itemToLend = item._id;
        const formData = new FormData(e.target);
        formData.append("id", itemToLend);
        const formDataObj = Object.fromEntries(formData.entries());
        const LIBRARY_ITEM_LEND_URL = import.meta.env.VITE_BACKEND_API_URL + "api/lend";
        try {
            const response = await customFetch(LIBRARY_ITEM_LEND_URL, {
                method: "PUT",
                body: JSON.stringify(formDataObj),
            });
            console.log("Entry was successfully updated");
            setItemLent(!itemLent);
            await new Promise(resolve => setTimeout(resolve, 2000));
            closePopup();

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
