import CardContainer from "../components/CardContainer"
import { useQuery } from "react-query"
import libraryData from "../../data/dbtest.json"

export default function All() {
    const fetchLib = async () => {
        const res = await fetch("http://localhost:5000/");
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

    // data.library.sort((a, b) => {
    //     if (a.title < b.title) {
    //         return -1;
    //     }
    //     if (a.title > b.title) {
    //         return 1;
    //     }
    //     return 0;
    // });

    return data.map((book) => (
        <CardContainer {...book} key={book.id} />
    ))
}
