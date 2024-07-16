import CardContainer from "../components/CardContainer"
// import libraryData from "../../data/dbtest.json"
import { useQuery } from "react-query";

export default function Manuals() {
    const fetchLib = () => {
        return libraryData;
    }
    const { data } = useQuery(
        "lib",
        fetchLib
    )
    if (!data) return null;

    const libraryManuals = (data.filter(obj => obj.category.includes("Manual")));



    return libraryManuals.map((book) => (
        <CardContainer {...book} key={book.id} />
    ))
}
