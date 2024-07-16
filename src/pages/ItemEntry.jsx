import React from 'react'

export default function ItemEntry() {
    return (
        <div>
            <h3>New Item Entry</h3>
            <br />
            <form action="/library" method="POST">
                <label for="title">Title</label>
                <input type="text" id="title" name="title" required></input>
                <label for="author">Author</label>
                <input type="text" id="author" name="author"></input>
                <label for="isbn">ISBN</label>
                <input type="number" id="isbn" name="isbn"></input>
                <label for="description">Description</label>
                <textarea id="description" name="description" required></textarea>
                <label for="cover">Cover Image</label>
                <input type="text" id="cover" name="cover"></input>
                <label for="category">Category</label>
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
