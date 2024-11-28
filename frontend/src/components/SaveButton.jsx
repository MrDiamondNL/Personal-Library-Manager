import { useState, useEffect } from 'react'
import defaultBookImage from "../imgs/stock cover image.jpg";
import { useAuth } from "../contexts/AuthContext";


export const SaveButton = ({ title, description, author, isbn, coverImage, trigger }) => {

    //const [book, setBook] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { currentUser } = useAuth();

    const submitData = async () => {

        const dataToSubmit = ({
            title: title,
            author: author,
            description: description,
            isbn: isbn,
            coverImage: coverImage ?? defaultBookImage,
            user: currentUser.uid
        });
        setIsSubmitting(true);
        console.log(dataToSubmit);

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

                trigger(true);

            } else {
                console.error("Unable to save to library", response.statusText);
                setIsSubmitting(false);
            }


        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        console.log("SaveButton Props:", { title, description, author, coverImage, isbn });
    }, [title, description, author, coverImage, isbn]);

    return (
        <button
            onClick={submitData}
            disabled={isSubmitting}
        >
            {isSubmitting ? "Saving..." : "Save to Library?"}
        </button>
    )
}
