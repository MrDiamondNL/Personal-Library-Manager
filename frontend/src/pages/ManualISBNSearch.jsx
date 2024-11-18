import { useState } from "react";
import CardContainer from "../components/CardContainer"
import CardDetails from "../components/CardDetails"
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import defaultBookImage from "../imgs/stock cover image.jpg";


export default function ManualISBNSearch() {
    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    console.log(import.meta.env.VITE_GOOGLE_API_KEY);
    const [isbn, setIsbn] = useState("");
    const [book, setBook] = useState(null);
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_API_KEY}`;
    const { currentUser } = useAuth();
    const [saved, setSaved] = useState(false);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                    coverImage: book?.imageLinks?.thumbnail ?? defaultBookImage,
                    user: currentUser.uid
                });
            } else {
                console.log("No book found");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchForBook();
        };

        const submitData = async () => {
            const dataToSubmit = book;
            setIsSubmitting(true);

            try {
                const response = await fetch("https://personal-library-manager.onrender.com/library", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSubmit),
                });

                if (response.ok) {

                    const responseClone = response.clone();

                    responseClone.json().then(result => {
                        console.log("Book was saved to Library", result);
                    }).catch(async () => {
                        const text = await response.text();
                        console.log("Book was saved to Library", text);
                    });

                    setSaved(true);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    console.error("Unable to save to library", response.statusText);
                    setIsSubmitting(false);
                }


            } catch (error) {
                console.log(error);
            }

        }



        return (
            <>
                <div className="manual_isbn_entry_container search-wrapper">
                    <h3>Search By ISBN</h3>
                    <input type="text" value={isbn} id="isbn_search" name="isbn_search" autoFocus placeholder="Enter ISBN" onChange={(e) => setIsbn(e.target.value)} onKeyDown={handleKeyDown}></input>
                    <button onClick={searchForBook} >Search</button>
                </div>

                <p>Search Divider Placeholder text</p>

                {book !== null ? (
                    <>
                        <CardDetails
                            {...book}
                            bookImage={book.coverImage}
                            description={book.description}
                        />
                        <br />
                        {saved ? (
                            <p>Saved to Library</p>
                        ) : (
                            <button
                                onClick={submitData}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save to Library?"}
                            </button>
                        )}
                    </>
                ) : (
                    <div id="reader"></div>
                )}

            </>

        );
    }