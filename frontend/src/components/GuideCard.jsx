import { useNavigate } from "react-router-dom";
import CardContainer from "./CardContainer"
import guideEntry from "../examples/guideEntry.json"
import defaultBookImage from "../imgs/stock cover image.jpg";

export const GuideCard = () => {
    const navigate = useNavigate();

    return (
        <div onClick={() => { navigate("/example_entry") }}>
            <CardContainer {...guideEntry} coverImage={defaultBookImage} key={23453453453} id={23453453453} />
        </div>
    )
}
