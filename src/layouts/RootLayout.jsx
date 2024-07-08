import { NavLink, Outlet } from "react-router-dom"

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
                <Outlet />
            </main>

            <div className="add-item-menu">add</div>
        </div>
    )
}
