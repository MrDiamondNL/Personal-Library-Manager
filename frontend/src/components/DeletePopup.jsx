import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export const DeletePopup = ({ item, closePopup }) => {

    const [entryDeleted, setEntryDeleted] = useState(false);
    const navigate = useNavigate();

    const deleteItem = async () => {
        const itemToDelete = item._id;
        const LIBRARY_ITEM_DELETE_URL = import.meta.env.VITE_BACKEND_API_URL + "api/delete";

        try {
            const response = await fetch(LIBRARY_ITEM_DELETE_URL, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: itemToDelete }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Entry was successfully deleted");
                setEntryDeleted(!entryDeleted);
                await new Promise(resolve => setTimeout(resolve, 2000));
                navigate("/");

            } else {
                console.error("Unable to delete entry", response.statusText);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {!entryDeleted && (
                <>
                    <h3>Delete Item</h3>
                    <p>This cannon be undone</p>
                    <div className="delete-popup-buttons">
                        <button onClick={closePopup}>Cancel</button>
                        <button className="delete_button" onClick={deleteItem}>Delete</button>
                    </div>
                </>
            )}
            {entryDeleted && (
                <p>Item Deleted Successfully</p>
            )}
        </div>
    )
}
