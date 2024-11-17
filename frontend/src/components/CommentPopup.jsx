import { useState } from 'react'

export const CommentPopup = ({ item, closePopup }) => {
    const [commentAdded, setCommentAdded] = useState(false);

    const submitComment = async (e) => {
        e.preventdefault();
        const itemToComment = item._id;
        const formData = new FormData(e.target);
        formData.append("id", itemToComment);
        const formDataObj = Object.fromEntries(formData.entries());
        console.log(formDataObj);

        try {
            const response = await fetch("https://personal-library-manager.onrender.com/comment", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formDataObj),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Entry was successfully updated");
                setCommentAdded(true);
                await new Promise(resolve => setTimeout(resolve, 2000));
                //closePopup();
            } else {
                console.error("Unable to update entry", response.statusText);
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div>
            {!commentAdded && (
                <>
                    <h3>Enter Comment</h3>
                    <form onSubmit={submitComment}>
                        <label htmlFor="comment">Comment: </label>
                        <input type="text" id="comment" name="comment" required></input>
                        <button>Submit</button>
                    </form>
                </>
            )}
            {commentAdded && (
                <p>Comment Added Successfully</p>
            )}

        </div>
    )
}
