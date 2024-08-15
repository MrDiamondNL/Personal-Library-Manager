import React from 'react'

export default function CardContainer({ title, description, author, isbn, bookImage }) {
    // console.log(title, description);
    let defaultBookImage = "https://s3proxy.cdn-zlib.se//covers299/collections/userbooks/3588aa5c63b7304c305b4801cb3a17313e2edb82d5b8dae75ec4bf328ff76991.jpg"
    return (
        <div className="card-container">
            <img src={bookImage !== "" ? bookImage : defaultBookImage}></img>
            <div className="card-container__info">
                <h3 className="title">{title}</h3>
                <p>{author}</p>
                <p>{isbn}</p>
                <p>{description}</p>

            </div>
        </div>
    )
}
