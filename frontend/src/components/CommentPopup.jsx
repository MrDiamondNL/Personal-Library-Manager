/* eslint-disable react/prop-types */
import { useState, useContext } from 'react'
import { CustomFetchContext } from "../contexts/CustomFetchContext";

export const CommentPopup = ({ item, closePopup }) => {
    const [commentAdded, setCommentAdded] = useState(false);
    const { customFetch } = useContext(CustomFetchContext);

    const submitComment = async (e) => {
        e.preventDefault();
        const itemToComment = item._id;
        const formData = new FormData(e.target);
        formData.append("id", itemToComment);
        const formDataObj = Object.fromEntries(formData.entries());

        const LIBRARY_ITEM_COMMENT_FETCH_URL = import.meta.env.VITE_BACKEND_API_URL + "api/comment";



        try {
            const response = await customFetch(LIBRARY_ITEM_COMMENT_FETCH_URL, {
                method: "PUT",
                body: JSON.stringify(formDataObj),
            });
            return response;
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
