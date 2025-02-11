import { useLocation } from "react-router-dom"
import CardContainer from "../components/CardContainer"
import { useQuery } from "react-query"
import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function SearchPage() {
    const { currentUser } = useAuth();

    const location = useLocation();
    const { query } = location.state || { query: "" };

    const fetchLib = async () => {
        const res = await fetch(`https://personal-library-manager.onrender.com/`);
        console.log(res);
        if (!res.ok) {
            throw new Error("Response was not ok");
        }
        return res.json();
    }
    const { data } = useQuery(
        "lib",
        fetchLib
    )
    if (!data) return (
        <LoadingSpinner />
    );

    data.sort((a, b) => {
        if (a.title < b.title) {
            return -1;
        }
        if (a.title > b.title) {
            return 1;
        }
        return 0;
    });

    const userBooks = data.filter(book => book.user === currentUser.uid);
    console.log(userBooks);
    const searchedData = userBooks.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );
    console.log("Is it working now")
    return searchedData.map((book) => (
        <CardContainer {...book} key={book._id} id={book._id} />
    ))
}
