import React from 'react'

export const LendPopup = () => {

    const lendItem = async (e) => {
        e.preventDefault();
        const itemToLend = selectedCard;
        const formData = new FormData(e.target);
        formData.append("id", itemToLend);
        const formDataObj = Object.fromEntries(formData.entries());
        console.log(formDataObj);

        try {
            const response = await fetch("https://personal-library-manager.onrender.com/lend", {
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
                showLendPopup(!lendPopup);
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
            {!itemLent && (
                <>
                    <h3>Enter Lender&apos;s Email</h3>
                    <form onSubmit={lendItem}>
                        <label htmlFor="email">Email: </label>
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
