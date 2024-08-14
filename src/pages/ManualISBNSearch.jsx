import { useState } from "react";


export default function ManualISBNSearch() {
    const [isbn, setIsbn] = useState();


    return (
        <div className="manual_isbn_entry_container">
            <h3>Search By ISBN</h3>
            <form>
                <input type="number" id="isbn_search" name="isbn_search" placeholder="Enter ISBN"></input>
                <button>Search</button>
            </form>
        </div>
    );
}