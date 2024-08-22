
export default function CardDetails({ title, description, author, isbn, coverImage }) {
    return (
        <div className="card-details ">
            <div className="card-details_header">
                <img src={coverImage !== undefined ? coverImage : defaultBookImage} alt="cover image" />
                <div className="card-details_header-sidebar">
                    <h2>{title}</h2>
                    <h3>{author}</h3>
                    <p>ISBN: {isbn}</p>
                </div>
            </div>
            <div className="card-details_body">
                <p>{description}</p>
            </div>
        </div>
    )
}