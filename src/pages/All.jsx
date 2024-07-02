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

    data.library.sort((a, b) => {
        if (a.title < b.title) {
            return -1;
        }
        if (a.title > b.title) {
            return 1;
        }
        return 0;
    });

    return data.library.map((book) => (
        <CardContainer {...book} key={book.id} />
    ))
}
