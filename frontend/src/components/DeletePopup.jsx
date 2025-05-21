import { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { CustomFetchContext } from "../contexts/CustomFetchContext";

export const DeletePopup = ({ item, closePopup }) => {

    const [entryDeleted, setEntryDeleted] = useState(false);
    const navigate = useNavigate();
    const { customFetch } = useContext(CustomFetchContext);

    const deleteItem = async () => {
        const itemToDelete = item._id;
        const LIBRARY_ITEM_DELETE_URL = import.meta.env.VITE_BACKEND_API_URL + "api/delete";


        try {
            const response = await customFetch(LIBRARY_ITEM_DELETE_URL, {
                method: "DELETE",
                body: JSON.stringify({ id: itemToDelete }),
            });
            setEntryDeleted(!entryDeleted);
            await new Promise(resolve => setTimeout(resolve, 2000));
            navigate("/");
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
