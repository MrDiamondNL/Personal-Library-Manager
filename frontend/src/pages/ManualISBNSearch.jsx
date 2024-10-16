import { useState } from "react";
import CardContainer from "../components/CardContainer"
import CardDetails from "../components/CardDetails"
import { useAuth } from "../contexts/AuthContext";


export default function ManualISBNSearch() {
    const [isbn, setIsbn] = useState("");
    const [book, setBook] = useState(null);
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    const { currentUser } = useAuth();

    const searchForBook = async () => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            if (data.totalItems > 0) {
                const book = data.items[0].volumeInfo;
                console.log(book);
                setBook({
                    title: book.title,
                    author: book.authors[0],
                    description: book?.description,
                    isbn: book.industryIdentifiers.find(industryIdentifiers => industryIdentifiers.type === "ISBN_13").identifier,
                    coverImage: book?.imageLinks?.thumbnail ?? undefined,
                    user: currentUser.uid
                });
            } else {
                console.log("No book found");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const submitData = async () => {
        const dataToSubmit = book;

        try {
            const response = await fetch("https://personal-library-manager.onrender.com/library", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Book was saved to Library");
            } else {
                console.error("Unable to save to library", response.statusText);
                console.log(book);
            }
        } catch (error) {
            console.log(error);
        }

    }



    return (
        <>
            <div className="manual_isbn_entry_container">
                <h3>Search By ISBN</h3>
                <input type="number" value={isbn} id="isbn_search" name="isbn_search" placeholder="Enter ISBN" onChange={(e) => setIsbn(e.target.value)}></input>
                <button onClick={searchForBook}>Search</button>
            </div>

            {book ? (
                <>
                    <CardDetails {...book} bookImage={book.coverImage} description={book.description} ></CardDetails><br />
                    <button onClick={submitData}>Save to Library?</button>
                </>
            ) : null}

        </>

    );
}