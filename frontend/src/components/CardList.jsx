import CardContainer from "../components/CardContainer"
import { useQuery } from "react-query"
import { useAuth } from "../contexts/AuthContext";
// import libraryData from "../../data/dbtest.json"

export default function CardList({ bookType }) {
    const { currentUser } = useAuth();

    const fetchLib = async () => {
        const res = await fetch(`https://personal-library-manager.onrender.com`);
        if (!res.ok) {
            throw new Error("Response was not ok");
        }
        return res.json();
    }
    const { data, refetch } = useQuery(
        "lib",
        fetchLib,
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
    console.log(data);
    console.log(bookType);
    const userBooks = data.filter(book =>
        book.user === currentUser.uid &&
        (!bookType || book.category === bookType)

    );

    return userBooks.map((book) => (
        <CardContainer {...book} key={book._id} id={book._id} refetch={refetch} />
    ))
}
