import { NavLink, Outlet } from "react-router-dom"
import CardContainer from "../components/CardContainer"
import { IconFilePlus, IconMenu2 } from '@tabler/icons-react';

export default function RootLayout() {
    return (
        <div className="root-layout">
            <header>
                <div className="menu_title_wrapper">
                    <div className="menu_toggle"><IconMenu2 stroke={1.75} /></div>
                    <div className="searh_bar_toggle"></div>
                </div>
                <h2 className="library-title">Your Library</h2>
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

            <div className="add-item-menu">
                <NavLink className="add_item_navlink" to="item_entry"><IconFilePlus stroke={1.25} /></NavLink>
            </div>
        </div>
    )
}
