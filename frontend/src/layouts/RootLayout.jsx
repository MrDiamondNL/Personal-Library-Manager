import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom"
import CardContainer from "../components/CardContainer"
import { IconFilePlus, IconMenu2, IconSearch } from '@tabler/icons-react';
import { useRef, useState } from "react";

export default function RootLayout() {
    const [openSearch, setOpenSearch] = useState(false);
    const [navOpen, setNavOpen] = useState(null);
    const [openAddItem, setOpenAddItem] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const divRef = useRef(null);
    const addRef = useRef(null);
    const location = useLocation();



    const toggleSearch = () => {
        setOpenSearch(!openSearch);
    }


    const toggleOpen = () => {
        if (navOpen === null) {
            setNavOpen(true);
        } else setNavOpen(!navOpen);
        document.addEventListener("mousedown", handleClickOutsideNav);
    }

    const handleClickOutsideNav = (event) => {
        if (divRef.current && !divRef.current.contains(event.target)) {
            setNavOpen(false);
            document.removeEventListener("mousedown", handleClickOutsideNav);
        }
    }

    const showAddItemMenu = () => {
        setOpenAddItem(!openAddItem);
        document.addEventListener("mousedown", handleClickOutsideAddMenu);
    }

    const handleClickOutsideAddMenu = (event) => {
        if (addRef.current && !addRef.current.contains(event.target)) {
            setOpenAddItem(false);
            document.removeEventListener("mousedown", handleClickOutsideAddMenu);
        }
    }

    const handleChange = (event) => {
        const newQuery = event.target.value;
        setQuery(newQuery);
        if (newQuery !== "") {
            navigate("/search_page", { state: { query: newQuery } });
        }
        if (newQuery === "" && location.pathname === "/search_page") {
            navigate("/");
        }
    }

    return (
        <div className="root-layout">
            <header>
                <div className="menu_title_wrapper">
                    <div className="menu_toggle" onClick={toggleOpen}><IconMenu2 stroke={1.75} /></div>
                    <h2 className="library-title">Your Library</h2>
                    {openSearch ? (
                        <div className="search_bar">
                            <input type="text" id="searchString" name="searchString" onChange={handleChange} placeholder="Search library..."></input>
                        </div>
                    ) : null}
                    <div className="search_bar_toggle" onClick={toggleSearch}><IconSearch stroke={1.5} /></div>
                </div>

                <nav>
                    <NavLink to="/">All</NavLink>
                    <NavLink to="books">Books</NavLink>
                    <NavLink to="manuals">Manuals</NavLink>
                    <NavLink to="misc">Miscellaneous</NavLink>
                </nav>
            </header>

            <div className={`navigation ${navOpen === false ? "closed" : ""} ${navOpen ? "active" : ""}`} ref={divRef}>
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

            <div className="show-add-item-menu" onClick={showAddItemMenu}><IconFilePlus stroke={1.25} />
                <div className={`add-item-menu${openAddItem ? "-active" : ""}`}>
                    <NavLink className="add_item_navlink" to="item_entry">Add Manually</NavLink>
                    <div>Add by barcode</div>
                    <NavLink className="manual_isbn_search" to="/manual_isbn_search">Search By ISBN</NavLink>
                </div>

            </div>
        </div>
    )
}
