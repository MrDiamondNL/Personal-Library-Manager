import { useLocation } from "react-router-dom"
import { useContext } from "react";
import CardContainer from "../components/CardContainer"
import { useQuery } from "react-query"
import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { CustomFetchContext } from "../contexts/CustomFetchContext";

export default function SearchPage() {
    const { currentUser } = useAuth();
    const { customFetch } = useContext(CustomFetchContext);

    const location = useLocation();
    const { query } = location.state || { query: "" };
    const url = import.meta.env.VITE_BACKEND_API_URL + "api/";

    const fetchLib = async () => {
        const res = await customFetch(url);
        return res;
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
    const searchedData = userBooks.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );
    return searchedData.map((book) => (
        <CardContainer {...book} key={book._id} id={book._id} />
    ))
}
