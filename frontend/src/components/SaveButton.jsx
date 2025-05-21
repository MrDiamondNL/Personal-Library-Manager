/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from 'react'
import defaultBookImage from "../imgs/stock cover image.jpg";
import { useAuth } from "../contexts/AuthContext";
import { CustomFetchContext } from "../contexts/CustomFetchContext";


export const SaveButton = ({ title, description, author, isbn, coverImage, category, trigger }) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { currentUser } = useAuth();
    const { customFetch } = useContext(CustomFetchContext);

    const submitData = async () => {

        const dataToSubmit = ({
            title: title,
            author: author,
            description: description,
            isbn: isbn,
            coverImage: coverImage ?? defaultBookImage,
            user: currentUser.uid,
            category: category ?? "Book"
        });
        setIsSubmitting(true);

        const LIBRARY_ITEM_SAVE_URL = import.meta.env.VITE_BACKEND_API_URL + "api/library";

        try {
            const response = await customFetch(LIBRARY_ITEM_SAVE_URL, {
                method: "POST",
                body: JSON.stringify(dataToSubmit),
            });

            console.log("Book was saved to Library", response);
            trigger(true);

        } catch (error) {
            console.log(error);
            setIsSubmitting(false);
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
