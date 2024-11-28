/* eslint-disable react/prop-types */
import { LendPopup } from "../LendPopup";
import { ReturnPopup } from "../ReturnPopup";
import { DeletePopup } from "../DeletePopup";
import { CommentPopup } from "../CommentPopup";
import { ImageCapture } from "../ImageCapture";
import { SavedPopup } from "../SavedPopup";

export const Popup = ({ type, item, closePopup }) => {

    return (
        <div className="popup_window">
            <div onClick={closePopup} className="overlay"></div>
            <div className="popup_content">
                {type === "lend" && <LendPopup item={item} closePopup={closePopup} />}
                {type === "return" && <ReturnPopup item={item} closePopup={closePopup} />}
                {type === "delete" && <DeletePopup item={item} closePopup={closePopup} />}
                {type === "comment" && <CommentPopup item={item} closePopup={closePopup} />}
                {type === "camera" && <ImageCapture closePopup={closePopup} />}
                {type === "saved" && <SavedPopup closePopup={closePopup} />}
            </div>
        </div>
    )
}
