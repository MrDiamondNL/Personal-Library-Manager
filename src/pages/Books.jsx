import CardContainer from "../components/CardContainer"
import libraryData from "../../data/dbtest.json"
import { useQuery } from "react-query";

export default function Books() {
    const fetchLib = () => {
        return libraryData;
    }
    const { data } = useQuery(
        "lib",
        fetchLib
    )
    if (!data) return null;

    const libraryBooks = (data.library.filter(obj => obj.category.includes("Book")));



    return libraryBooks.map((book) => (
        <CardContainer {...book} key={book.id} />
    ))
}
