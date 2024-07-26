import { NavLink, Outlet, useNavigate } from "react-router-dom"
import CardContainer from "../components/CardContainer"
import { IconFilePlus, IconMenu2, IconSearch } from '@tabler/icons-react';
import { useRef, useState } from "react";

export default function RootLayout() {
    const [openSearch, setOpenSearch] = useState(false);
    const toggleSearch = () => {
        setOpenSearch(!openSearch);
    }

    const [navOpen, setNavOpen] = useState(false);
    const toggleOpen = () => {
        setNavOpen(!navOpen);
        document.addEventListener("mousedown", handleClickOutside);
        console.log(navOpen);
    }

    const handleClickOutside = () => {
        if (divRef.current && !divRef.current.contains(event.target)) {
            console.log("Clicked outside of custom div")
            setNavOpen(false);
            console.log(navOpen);
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }

    let divRef = useRef(null);

    const [query, setQuery] = useState("");
    const navigate = useNavigate;

    return (
        <div className="root-layout">
            <header>
                <div className="menu_title_wrapper">
                    <div className="menu_toggle" onClick={toggleOpen}><IconMenu2 stroke={1.75} /></div>
                    {openSearch ? (
                        <div className="search_bar">
                            <input type="text" placeholder="Search library..."></input>
                        </div>
                    ) : null}
                    <div className="search_bar_toggle" onClick={toggleSearch}><IconSearch stroke={1.5} /></div>
                </div>
                <h2 className="library-title">Your Library</h2>
                <nav>
                    <NavLink to="/">All</NavLink>
                    <NavLink to="books">Books</NavLink>
                    <NavLink to="manuals">Manuals</NavLink>
                    <NavLink to="misc">Miscellaneous</NavLink>
                </nav>
            </header>

            <div className={`navigation${navOpen ? "-active" : ""}`} ref={divRef}>
                <nav>
                    <NavLink to="/">All</NavLink>
                    <NavLink to="books">Books</NavLink>
                    <NavLink to="manuals">Manuals</NavLink>
                    <NavLink to="misc">Miscellaneous</NavLink>
                </nav>
            </div>

            <div className="navigation__backdrop"></div>

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
