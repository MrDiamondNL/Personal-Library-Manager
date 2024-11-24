import { useState, useRef, useContext, useEffect } from 'react'
import { SearchedEntry } from "../components/SearchedEntry";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { CardSelectedContext } from "../contexts/CardSelectedContext";
import CardDetails from "../components/CardDetails";


export const TitleSearch = () => {
    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [filteredResults, setFilteredResults] = useState([]);
    const [titleSelected, setTitleSelected] = useState();
    const [hasSearched, setHasSearched] = useState(false);

    const containerRef = useRef(null);
    const { selectedCard, setSelectedCard, registerCardRef } = useContext(CardSelectedContext);

    const searchTitle = async () => {
        const parsedTitle = title.replace(/ /g, "+");
        const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${parsedTitle}&key=${GOOGLE_API_KEY}`;

        setLoading(true);
        setTitleSelected(null);
        setSelectedCard(null);
        setHasSearched(true);

        try {
            const response = await fetch(url);
            const data = await response.json()

            const uniqueTitles = [];
            const seenTitles = new Set();

            for (const item of data.items || []) {
                if (uniqueTitles.length >= 5) break;
                if (!seenTitles.has(item.volumeInfo.title)) {
                    seenTitles.add(item.volumeInfo.title);
                    uniqueTitles.push(item);
                }
            }

            setFilteredResults(uniqueTitles);
            console.log(uniqueTitles);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        console.log(filteredResults);

    }

    const foundTitle = (id) => {
        if (selectedCard !== null) {
            const selected = filteredResults.find(item => item.id === id);
            setTitleSelected(selected);
        }

    }

    useEffect(() => {
        registerCardRef(selectedCard, containerRef.current);
    }, [selectedCard, registerCardRef]);

    useEffect(() => {
        foundTitle(selectedCard);
    }, [selectedCard]);

    return (
        <div className="search-wrapper">
            <h3>Search by Title</h3>
            <input type="text" value={title} id="title_search" name="title_search" autoFocus placeholder="Enter Title" onChange={(e) => setTitle(e.target.value)}></input>
            <button onClick={searchTitle}>Search</button>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {!titleSelected && (
                        <div className="results">
                            {filteredResults.length > 0 ? (
                                filteredResults.map((item) => (
                                    <SearchedEntry
                                        key={item.id}
                                        id={item.id}
                                        title={item.volumeInfo.title}
                                        authors={item.volumeInfo.authors || "Unknown Author"}
                                        description={item.volumeInfo.description || "No Description Available"}
                                        coverImage={item.volumeInfo.imageLinks?.thumbnail}
                                    />
                                ))
                            ) : hasSearched && (
                                <p>No results found. Try a different title.</p>
                            )}
                        </div>
                    )}
                    {titleSelected && (
                        <CardDetails
                            title={titleSelected.volumeInfo.title}
                            description={titleSelected.volumeInfo.description}
                            author={titleSelected.volumeInfo.authors[0]}
                            coverImage={titleSelected.volumeInfo.imageLinks.thumbnail}
                            isbn={titleSelected.volumeInfo.industryIdentifiers.find(industryIdentifiers => industryIdentifiers.type === "ISBN_13")?.identifier}
                        />
                    )}
                </>
            )}
        </div>
    );
}
