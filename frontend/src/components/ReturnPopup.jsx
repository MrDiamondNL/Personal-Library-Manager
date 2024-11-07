import React from 'react'

export const ReturnPopup = () => {

    const returnItem = async () => {
        const itemToReturn = { id };

        try {
            const response = await fetch("https://personal-library-manager.onrender.com/return", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(itemToReturn)
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Entry was successfully returned");
                setItemReturned(!itemReturned);
                await new Promise(resolve => setTimeout(resolve, 2000));
                showReturnPopup(!returnPopup);
                refetch();
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
                    <p>{lentEmail}</p>
                    <button onClick={returnItem}>Confirm</button>
                </>
            }
            {itemReturned &&
                <p>Item Successfully Returned</p>
            }
        </div>
    )
}
