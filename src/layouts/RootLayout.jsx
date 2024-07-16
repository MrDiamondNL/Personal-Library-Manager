import { NavLink, Outlet } from "react-router-dom"
import CardContainer from "../components/CardContainer"

export default function RootLayout() {
    return (
        <div className="root-layout">
            <header>
                <h2 className="library-title">Your (custom library title) Library</h2>
                <nav>
                    <NavLink to="/">All</NavLink>
                    <NavLink to="books">Books</NavLink>
                    <NavLink to="manuals">Manuals</NavLink>
                    <NavLink to="misc">Miscellaneous</NavLink>
                </nav>
            </header>

            <main>
                <div className="library__container">
                    <Outlet />
                </div>
            </main>

            <div className="add-item-menu">add</div>
        </div>
    )
}
