import CardContainer from "../components/CardContainer"
// import libraryData from "../../data/dbtest.json"
import { useQuery } from "react-query";

export default function Books() {
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

    if (!data) return null;

    const libraryBooks = (data.filter(obj => obj.category.includes("Book")));



    return libraryBooks.map((book) => (
        <CardContainer {...book} key={book._id} />
    ))
}
