import { useLocation } from "react-router-dom"
import CardContainer from "../components/CardContainer"
import { useQuery } from "react-query"

export default function SearchPage() {
    let selectedDb = "library"
    const location = useLocation();
    const { query } = location.state || { query: "" };

    const fetchLib = async () => {
        const res = await fetch(`http://localhost:5000/`);
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
        <div>Loading...</div>
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

    const searchedData = data.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );

    return searchedData.map((book) => (
        <CardContainer {...book} key={book._id} />
    ))
}
