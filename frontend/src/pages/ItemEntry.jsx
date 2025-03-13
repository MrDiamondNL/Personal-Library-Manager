
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Popup } from "../components/Modals/Popup";
import { useState, useRef } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { getIdToken } from "firebase/auth"

export default function ItemEntry() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [photoPopup, setPhotoPopUp] = useState(false);
    const fileInputRef = useRef(null);
    const [capturedImageFile, setCapturedImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("user", currentUser.uid);
        setIsSubmitting(true);

        try {
            let coverImageURL = null;

            if (capturedImageFile) {

                const imageRef = ref(storage, `images/${capturedImageFile.name}`);

                try {
                    await uploadBytes(imageRef, capturedImageFile);
                    coverImageURL = await getDownloadURL(imageRef);
                    console.log("upload successful");
                } catch (uploadError) {
                    // More detailed error logging
                    console.error("Upload error:", {
                        message: uploadError.message,
                        code: uploadError.code,
                        fullError: uploadError
                    });
                }

            }

            const formDataObj = Object.fromEntries(formData.entries());
            if (coverImageURL) {
                formDataObj.coverImage = coverImageURL
            }

            const LIBRARY_ITEM_SAVE_URL = import.meta.env.VITE_BACKEND_API_URL + "api/library"

            const response = await fetch(LIBRARY_ITEM_SAVE_URL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formDataObj),
            });

            if (response.ok) {
                console.log("Item entered successfully");
                navigate("/");
            } else {
                console.log("Could not enter Item");
            }
        } catch (error) {
            console.log(error);
            setIsSubmitting(false);
        }
    }

    const handleImageCapture = (imageFile) => {
        setCapturedImageFile(imageFile);
    }

    const closePopup = () => {
        setPhotoPopUp(false);
    }

    const openPhotoPopup = () => {
        setPhotoPopUp(true);
    }

    const closeSecondPopup = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        navigate("/");
    }

    return (
        <div className="item_entry_container">
            <h3>New Item Entry</h3>
            <br />
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" required></input>
                <br />
                <label htmlFor="author">Author</label>
                <input type="text" id="author" name="author"></input>
                <br />
                <label htmlFor="isbn">ISBN</label>
                <input type="text" id="isbn" name="isbn"></input>
                <br />
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description"></textarea>
                <br />
                <label htmlFor="cover">Cover Image - Optional</label>
                <div className="file-input-wrapper">
                    <input className="file-input" ref={fileInputRef} type="file" id="cover" name="cover" disabled ></input>
                    {capturedImageFile && (
                        <div className="file-name">
                            {capturedImageFile.name}
                        </div>
                    )}
                </div>
                <button type="button" onClick={openPhotoPopup}>Take Photo</button>
                {photoPopup &&
                    <Popup
                        type="camera"
                        closePopup={closePopup}
                        additionalProps={{
                            onImageCapture: handleImageCapture
                        }}
                    />
                }
                <br />
                <label htmlFor="category">Category</label>
                <select name="category" id="category" required>
                    <option value="Book">Book</option>
                    <option value="Manual">Item</option>
                    <option value="Misc">Miscellaneous</option>
                </select>
                <button disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save to Library?"}</button>
                {isSubmitting && (
                    <Popup type={"saved"} closePopup={closeSecondPopup} />
                )}
            </form>
        </div>
    )
}
