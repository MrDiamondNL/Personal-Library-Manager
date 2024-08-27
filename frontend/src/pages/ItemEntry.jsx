import React from 'react'

export default function ItemEntry() {
    return (
        <div className="item_entry_container">
            <h3>New Item Entry</h3>
            <br />
            <form action="https://personal-library-manager.onrender.com/library" method="POST">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" required></input>
                <br />
                <label htmlFor="author">Author</label>
                <input type="text" id="author" name="author"></input>
                <br />
                <label htmlFor="isbn">ISBN</label>
                <input type="number" id="isbn" name="isbn"></input>
                <br />
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" required></textarea>
                <br />
                <label htmlFor="cover">Cover Image</label>
                <input type="text" id="cover" name="cover"></input>
                <br />
                <label htmlFor="category">Category</label>
                <select name="category" id="category" required>
                    <option value="Book">Book</option>
                    <option value="Manual">Item</option>
                    <option value="Misc">Miscellaneous</option>
                </select>
                <button>Submit</button>
            </form>
        </div>
    )
}
