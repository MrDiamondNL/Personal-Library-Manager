

export const Popup = () => {

    // const showLendPopup = () => {
    //     setLendPopup(!lendPopup);
    // }

    // const showReturnPopup = () => {
    //     setReturnPopup(!returnPopup);
    // }

    // const showDeleteConfirm = () => {
    //     setPopup(!popup);
    // }

    return (
        <div className="popup_window">
            <div onClick={showDeleteConfirm} className="overlay"></div>
            <div className="popup_content">

            </div>
        </div>
    )
}
