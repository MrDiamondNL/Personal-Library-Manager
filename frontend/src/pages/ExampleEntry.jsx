import { useState } from 'react'
import item from "../examples/guideEntry.json"
import { LendToken } from "../components/LendToken";
import defaultBookImage from "../imgs/stock cover image.jpg";
import { IconPlus, IconTrash, IconCornerUpLeft, IconShare3 } from '@tabler/icons-react';

export const ExampleEntry = () => {
    const [expandedDescription, setExpandedDescription] = useState(false);


    const toggleDescription = () => {
        setExpandedDescription(!expandedDescription);
    }

    return (
        <div className="card-details ">
            <div className="card-details_header">
                <img src={item.coverImage !== undefined ? item.coverImage : defaultBookImage} alt="cover image" />
            </div>
            <div className="card-details_body">
                <h2>{item.title}</h2>
                <div className="card-details_body_token-wrapper">
                    <h3 className="card-author">{item.author}</h3>
                    {item.isLent ? (
                        <LendToken lender={item.lentEmail} />
                    ) : null}
                </div>


                <div className="options-bar">

                    {item.isLent ? (
                        <button><IconCornerUpLeft stroke={2} />Return</button>
                    ) : (
                        <button><IconShare3 stroke={2} />Lend</button>
                    )}
                    <button><IconPlus stroke={2} />Comment</button>
                    <button className="delete_button"><IconTrash stroke={2} />Delete</button>
                </div>

                <p className="description-text">
                    {!expandedDescription ? (
                        <>
                            {item?.description?.substring(0, 200)}{item?.description?.length > 200 ? "..." : ""}
                        </>
                    )
                        : item?.description
                    }

                </p>
                {item?.description?.length > 200 && (
                    <button className="description-button" onClick={toggleDescription}>
                        {expandedDescription ? 'Show Less' : 'Show More'}
                    </button>
                )}
                <h4>Comment Section</h4>
                <div className="comments-section">
                    {item.comments.length === 0 ? (
                        <p>No Comments Added</p>
                    ) : (
                        item.comments.toReversed().map((comment, index) => (
                            <div key={index} className="comment-entry">
                                <p className="comment-date">{new Date(comment.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })}</p>
                                <p className="comment-text">{comment.text}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
