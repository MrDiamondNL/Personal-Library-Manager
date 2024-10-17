import CardContainer from "../components/CardContainer"
import { useQuery } from "react-query"
// import libraryData from "../../data/dbtest.json"

export default function CardList({ bookType }) {


    const fetchLib = async () => {
        const res = await fetch(`https://personal-library-manager.onrender.com`);
        if (!res.ok) {
            throw new Error("Response was not ok");
        }
        return res.json();
    }
    const { data, refetch } = useQuery(
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

    let books = data;
    if (bookType) {
        books = data.filter(obj => obj.category.includes(bookType));
    }

    //const libraryBooks = (data.filter(obj => obj.category.includes("Book")));


    return books.map((book) => (
        <CardContainer {...book} key={book._id} id={book._id} refresh={refetch} />
    ))
}
