/* eslint-disable react/prop-types */
import { useRef, useContext } from 'react'
import defaultBookImage from "../imgs/stock cover image.jpg";
import { CardSelectedContext } from "../contexts/CardSelectedContext";



export const SearchedEntry = ({ id, title, author, description, coverImage }) => {

  const containerRef = useRef(null);
  const { setSelectedCard } = useContext(CardSelectedContext);


  const cardSelected = (event) => {
    event.stopPropagation();
    setSelectedCard(id);
  }

  return (
    <div className={`card-container`} ref={containerRef} onClick={cardSelected}>
      <div className="cover-img-wrapper">
        <img src={coverImage ?? defaultBookImage}></img>
      </div>
      <div className="card-container__info">
        <h3 className="title">{title?.substring(0, 100)}{title?.length > 100 ? "..." : ""}</h3>
        <div className="card-details_body_token-wrapper">
          <h3 className="card-author">{author}</h3>
        </div>
        <p>{description?.substring(0, 80)}{description?.length > 80 ? "..." : ""}</p>
      </div>
    </div>
  )
}
