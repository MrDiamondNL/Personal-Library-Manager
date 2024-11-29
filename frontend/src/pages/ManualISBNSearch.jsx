import { useState } from "react";
import CardDetails from "../components/CardDetails"
import { useAuth } from "../contexts/AuthContext";
import { SaveButton } from "../components/SaveButton";
import defaultBookImage from "../imgs/stock cover image.jpg";
import { Popup } from "../components/Modals/Popup";
import { useNavigate } from "react-router-dom";
import { IconX } from '@tabler/icons-react';



export default function ManualISBNSearch() {
    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const [isbn, setIsbn] = useState("");
    const [book, setBook] = useState(null);
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_API_KEY}`;
    const { currentUser } = useAuth();
    const [saved, setSaved] = useState(false);
    const navigate = useNavigate();
    //const [isSubmitting, setIsSubmitting] = useState(false);

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

    const closePopup = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSaved(false);
        navigate("/");
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchForBook();
        }
    }





    return (
        <>
            <div className="manual_isbn_entry_container search-wrapper">
                <h3>Search By ISBN</h3>
                <div className="search-field-wrapper" onClick={() => setIsbn("")}>
                    <input type="text" value={isbn} id="isbn_search" name="isbn_search" autoFocus placeholder="Enter ISBN" onChange={(e) => setIsbn(e.target.value)} onKeyDown={handleKeyDown}></input>
                    <div className="clear-field-icon" alt="Clear"><IconX stroke={2} /></div>
                </div>

                <button onClick={searchForBook} >Search</button>
            </div>



            {book !== null ? (
                <>
                    <p>Results</p>

                    <CardDetails
                        {...book}
                        bookImage={book.coverImage}
                        description={book.description}
                    />
                    <br />
                    <SaveButton
                        title={book.title}
                        description={book.description}
                        author={book.authors}
                        coverImage={book.coverImage}
                        isbn={book.isbn}
                        trigger={setSaved}
                    />
                    {saved && (
                        <Popup type={"saved"} closePopup={closePopup} />
                    )}
                </>
            ) : (
                <div>
                    <p>No Results Found</p>
                </div>
            )}

        </>

    );
}