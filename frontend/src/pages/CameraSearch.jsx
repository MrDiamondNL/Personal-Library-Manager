import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import CardDetails from "../components/CardDetails"
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const CameraSearch = () => {

    const [scanResult, setScanResult] = useState(null);
    //const [isbn, setIsbn] = useState("");
    const [book, setBook] = useState(null);
    // const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    const { currentUser } = useAuth()
    const [saved, setSaved] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", {
            qrbox: {
                width: 300,
                height: 100,
            },
            aspectRatio: 2,
            fps: 5,
        });

        scanner.render(success, error);

        async function success(result) {
            scanner.clear();
            //setIsbn(result);
            await searchForBook(result);
        }

        function error(err) {
            console.warn(err);
        }
    }, []);

    const updateSaved = () => {
        setSaved(!saved);
    }

    const searchForBook = async (result) => {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${result}`);
            const data = await response.json();
            console.log(data);


            if (data.totalItems > 0) {
                const book = data.items[0].volumeInfo;
                console.log(book);
                await setBook({
                    title: book.title,
                    author: book.authors[0],
                    description: book?.description,
                    isbn: book.industryIdentifiers.find(industryIdentifiers => industryIdentifiers.type === "ISBN_13").identifier,
                    coverImage: book?.imageLinks?.thumbnail ?? undefined,
                    user: currentUser.uid
                });
                updateSaved;
                await new Promise(resolve => setTimeout(resolve, 2000));
                navigate("/");

            } else {
                console.log("No book found");
            }
        } catch (err) {
            console.log(err);
        }

        console.log(book);
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
            }
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div className="scanner-wrapper">
            <h1>Scan Barcode</h1>
            {book !== null
                ? <>
                    <CardDetails {...book} bookImage={book.coverImage} description={book.description} ></CardDetails><br />
                    {saved !== true
                        ? <button onClick={submitData}>Save to Library?</button>
                        : <p>Saved to Library</p>
                    }
                </>
                : <div id="reader"></div>
            }
        </div>

    )
}
