import React from 'react'

export const DeletePopup = () => {

    const deleteItem = async () => {
        const itemToDelete = { id };
        console.log(id);
        console.log(itemToDelete);

        try {
            const response = await fetch("https://personal-library-manager.onrender.com/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(itemToDelete),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Entry was successfully deleted");
                setEntryDeleted(!entryDeleted);
                await new Promise(resolve => setTimeout(resolve, 2000));
                setPopup(!popup);
                refetch();

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
                    <div>
                        <button onClick={showDeleteConfirm}>Cancel</button>
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
