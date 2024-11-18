import { useLocation } from "react-router-dom"
import CardContainer from "../components/CardContainer"
import { useQuery } from "react-query"
import { useAuth } from "../contexts/AuthContext";

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
        <div className="loading-container"><svg fill="hsl(228, 97%, 42%)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" /></path></svg></div>
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
    console.log("Is it working now")
    return searchedData.map((book) => (
        <CardContainer {...book} key={book._id} />
    ))
}
