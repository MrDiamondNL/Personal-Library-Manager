import CardContainer from "../components/CardContainer"
import { useQuery } from "react-query"
import libraryData from "../../data/dbtest.json"

export default function All() {
    const fetchLib = () => {
        return libraryData;
    }
    const { data } = useQuery(
        "lib",
        fetchLib
    )
    if (!data) return null;

    return data.library.map((book) => (
        <CardContainer {...book} key={book.id} />
    ))
}
