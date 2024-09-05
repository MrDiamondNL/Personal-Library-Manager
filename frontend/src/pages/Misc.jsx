import CardContainer from "../components/CardContainer"
// import libraryData from "../../data/dbtest.json"
import { useQuery } from "react-query";

export default function Misc() {
    const fetchLib = async () => {
        const res = await fetch(`https://personal-library-manager.onrender.com/`);
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

    const libraryMisc = (data.filter(obj => obj.category.includes("Misc")));



    return libraryMisc.map((book) => (
        <CardContainer {...book} key={book._id} />
    ))
}
