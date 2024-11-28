import { useEffect } from 'react'

export const SavedPopup = ({ closePopup }) => {

    useEffect(() => {
        closePopup();
    }, [closePopup]);

    return (
        <div>
            <p>Saved to Library</p>
        </div>
    )
}
