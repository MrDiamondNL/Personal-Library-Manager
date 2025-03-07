/* eslint-disable react/prop-types */
import { useState } from 'react'

export const CommentPopup = ({ item, closePopup }) => {
    const [commentAdded, setCommentAdded] = useState(false);

    const submitComment = async (e) => {
        e.preventDefault();
        const itemToComment = item._id;
        const formData = new FormData(e.target);
        formData.append("id", itemToComment);
        const formDataObj = Object.fromEntries(formData.entries());
        console.log(formDataObj);

        const LIBRARY_ITEM_COMMENT_FETCH_URL = import.meta.env.VITE_BACKEND_API_URL + "comment";


        try {
            const response = await fetch(LIBRARY_ITEM_COMMENT_FETCH_URL, {
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
            {!commentAdded && (
                <>
                    <h3>Leave a Comment</h3>
                    <form onSubmit={submitComment}>
                        <textarea className="comment-textarea" id="comment" name="comment" rows={4} required></textarea>
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
