import React from 'react'

export default function CardContainer({ title, description }) {
    // console.log(title, description);
    return (
        <div className="card-container">
            <p>{title}</p>
            <p>{description}</p>
        </div>
    )
}
