import { useState } from "react";
import CardContainer from "../components/CardContainer"
import CardDetails from "../components/CardDetails"
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";


export default function ManualISBNSearch() {
    const [isbn, setIsbn] = useState("");
    const [book, setBook] = useState(null);
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
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

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevents form submission if within a form
            searchForBook(); // Calls search function
        }
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
                // Clone the response to handle both JSON and plain text
                const responseClone = response.clone();

                // Attempt to parse as JSON
                responseClone.json().then(result => {
                    console.log("Book was saved to Library", result);
                }).catch(async () => {
                    // Fallback to text if JSON parsing fails
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

            // if (response.ok) {
            //     const result = await response.json();
            //     console.log("Book was saved to Library");
            //     setSaved(true);
            //     await new Promise(resolve => setTimeout(resolve, 1500));
            //     window.location.reload();
            //     // setTimeout(() => {
            //     //     window.location.reload();
            //     // }, 1500);
            //     // await new Promise(resolve => setTimeout(resolve, 2000));
            //     // navigate("/");
            // } else {
            //     console.error("Unable to save to library", response.statusText);
            //     console.log(book);
            // }
        } catch (error) {
            console.log(error);
        }

    }



    return (
        <>
            <div className="manual_isbn_entry_container">
                <h3>Search By ISBN</h3>
                <input type="number" value={isbn} id="isbn_search" name="isbn_search" autoFocus placeholder="Enter ISBN" onChange={(e) => setIsbn(e.target.value)}></input>
                <button onClick={searchForBook} onKeyDown={handleKeyDown}>Search</button>
            </div>

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