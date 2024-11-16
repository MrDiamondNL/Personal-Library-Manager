import React from 'react'

export const CommentPopup = ({ item, closePopup }) => {

    const submitComment = (e) => {
        const itemToComment = item._id;
        const formData = new FormData(e.target);
        formData.append("id", itemToComment);
        const formDataObj = Object.fromEntries(formData.entries());
        console.log(formDataObj);
    }


    return (
        <div>
            <h3>Enter Comment&apos;s Email</h3>
            <form onSubmit={submitComment}>
                <label htmlFor="comment">Comment: </label>
                <input type="text" id="comment" name="comment" required></input>
                <button>Submit</button>
            </form>
        </div>
    )
}
