import { useState } from "react";
import CardContainer from "../components/CardContainer"


export default function ManualISBNSearch() {
    const [isbn, setIsbn] = useState("");
    const [book, setBook] = useState(null);
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

    const searchForBook = async () => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            // console.log(data);

            if (data.totalItems > 0) {
                const book = data.items[0].volumeInfo;
                // console.log(book);
                setBook({
                    title: book.title,
                    author: book.authors[0],
                    description: book.description,
                    isbn: book.industryIdentifiers[0].identifier,
                    coverImage: book.imageLinks.thumbnail
                });
            } else {
                console.log("No book found");
            }
        } catch (err) {
            console.log(err);
        }

        console.log(book);
    }



    return (
        <>
            <div className="manual_isbn_entry_container">
                <h3>Search By ISBN</h3>
                <input type="number" value={isbn} id="isbn_search" name="isbn_search" placeholder="Enter ISBN" onChange={(e) => setIsbn(e.target.value)}></input>
                <button onClick={searchForBook}>Search</button>
            </div>

            <CardContainer {...book} bookImage={book.coverImage} description={book.description.substring(0, 40) + "..."} ></CardContainer>
        </>

    );
}