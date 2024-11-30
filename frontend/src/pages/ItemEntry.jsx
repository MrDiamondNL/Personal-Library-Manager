
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Popup } from "../components/Modals/Popup";
import { useState, useRef } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function ItemEntry() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [photoPopup, setPhotoPopUp] = useState(false);
    const fileInputRef = useRef(null);
    const [capturedImageFile, setCapturedImageFile] = useState(null);
    //const [uploadedImageURL, setUploadedImageURL] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("user", currentUser.uid);

        //console.log(formDataObj);

        try {
            let coverImageURL = null;

            if (capturedImageFile) {
                const imageRef = ref(storage, `images/${currentUser.displayName}/${capturedImageFile.name}`);
                await uploadBytes(imageRef, capturedImageFile);
                coverImageURL = await getDownloadURL(imageRef);
            }

            const formDataObj = Object.fromEntries(formData.entries());
            if (coverImageURL) {
                formDataObj.coverImage = coverImageURL
            }

            const response = await fetch("https://personal-library-manager.onrender.com/library", {
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
        }
    }

    const handleImageCapture = (imageFile) => {
        setCapturedImageFile(imageFile);

        if (fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(imageFile);
            fileInputRef.current.files = dataTransfer.files;
        }
    }

    const closePopup = () => {
        setPhotoPopUp(false);
    }

    const openPhotoPopup = () => {
        setPhotoPopUp(true);
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
                <button>Submit</button>
            </form>
        </div>
    )
}
