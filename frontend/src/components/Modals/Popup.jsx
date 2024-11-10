import { LendPopup } from "../LendPopup";
import { ReturnPopup } from "../ReturnPopup";
import { DeletePopup } from "../DeletePopup";
import { CommentPopup } from "../CommentPopup";

export const Popup = ({ type, item, closePopup }) => {

    return (
        <div className="popup_window">
            <div onClick={closePopup} className="overlay"></div>
            <div className="popup_content">
                {type === "lend" && <LendPopup item={item} />}
                {type === "return" && <ReturnPopup item={item} />}
                {type === "delete" && <DeletePopup item={item} closePopup={closePopup} />}
                {type === "comment" && <CommentPopup item={item} />}
            </div>
        </div>
    )
}
