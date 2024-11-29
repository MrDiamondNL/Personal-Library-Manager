import defaultBookImage from "../imgs/stock cover image.jpg";

export default function CardDetails({ title, description, author, isbn, coverImage }) {
    return (
        <div className="card-details ">
            <div className="card-details_header">
                <img src={coverImage !== undefined ? coverImage : defaultBookImage} alt="cover image" />

            </div>
            <div className="card-details_body">
                <div className="card-details_header-sidebar">
                    <h2>{title}</h2>
                    <h3 className="card-author">{author}</h3>
                    <p>ISBN: {isbn}</p>
                </div>
                <p>{description?.substring(0, 200)}</p>
            </div>
        </div>
    )
}