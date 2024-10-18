import CardContainer from "../components/CardContainer"
import { useQuery } from "react-query"
import { useAuth } from "../contexts/AuthContext";
// import libraryData from "../../data/dbtest.json"

export default function All() {
    const { currentUser } = useAuth();

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

    const userBooks = data.filter(data => data.user = currentUser.uid);
    console.log(userBooks);

    return userBooks.map((book) => (
        <CardContainer {...book} key={book._id} id={book._id} />
    ))
}
