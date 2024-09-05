import CardContainer from "../components/CardContainer"
import { useQuery } from "react-query"
// import libraryData from "../../data/dbtest.json"

export default function All() {
    let selectedDb = "library"

    const fetchLib = async () => {
        const res = await fetch(`https://personal-library-manager.onrender.com`);
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

    return data.map((book) => (
        <CardContainer {...book} key={book._id} />
    ))
}
