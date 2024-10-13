
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"

export default function ItemEntry() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("user", currentUser.uid);
        const formDataObj = Object.fromEntries(formData.entries());
        console.log(formDataObj);

        try {
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
                <input type="number" id="isbn" name="isbn"></input>
                <br />
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description"></textarea>
                <br />
                <label htmlFor="cover">Cover Image</label>
                <input type="text" id="cover" name="cover"></input>
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
