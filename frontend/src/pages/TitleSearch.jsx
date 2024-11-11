import { useState } from 'react'

export const TitleSearch = () => {

    const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${title}`;
    const [title, setTitle] = useState();

    return (
        <div>
            <h3>Search by Title</h3>
            <input type="text" value={title} id="title_search" name="title_search" autoFocus placeholder="Enter Title" onChange={(e) => setTitle(e.target.value)}></input>
        </div>
    )
}
