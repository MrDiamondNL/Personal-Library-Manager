import { NavLink, Outlet } from "react-router-dom"

export default function RootLayout() {
    return (
        <div className="root-layout">
            <header>
                <h2 className="library-title">Your (custom library title) Library</h2>
                <nav>
                    <NavLink to="/">All</NavLink>
                    <NavLink t0="books">Books</NavLink>
                    <NavLink t0="manuals">Manuals</NavLink>
                    <NavLink t0="misc">Miscellaneous</NavLink>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    )
}
