import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom"
import { IconFilePlus, IconMenu2, IconSearch, IconBooks, IconX } from '@tabler/icons-react';
import { useRef, useState, useEffect } from "react";
import { CardSelectedProvider } from "../contexts/CardSelectedContext";
import { useAuth } from "../contexts/AuthContext";
import { LoginHeader } from "../components/LoginHeader";
import { CustomFetchProvider } from "../contexts/CustomFetchContext";

export default function RootLayout() {
    const [openSearch, setOpenSearch] = useState(false);
    const [navOpen, setNavOpen] = useState(null);
    const [openAddItem, setOpenAddItem] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const divRef = useRef(null);
    const addRef = useRef(null);
    const location = useLocation();
    const { currentUser, logOut } = useAuth();

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

    const closeNav = () => {
        setNavOpen(false);
        document.removeEventListener("mousedown", handleClickOutsideNav);
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

    const handleLogout = async () => {
        try {
            await logOut();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="root-layout">
            <header>
                <div className="menu_title_wrapper">
                    <div className="content_container">
                        <div className="menu_toggle" onClick={toggleOpen}><IconMenu2 stroke={1.75} /></div>

                        {openSearch ? (
                            <div className="search_bar">
                                <input type="text" id="searchString" name="searchString" onChange={handleChange} placeholder="Search library..."></input>
                            </div>
                        ) : <h2 className="library-title"><IconBooks stroke={1.5} /> Bibliotecha</h2>}
                        <div className="search_bar_toggle" onClick={toggleSearch}><IconSearch stroke={1.5} /></div>
                    </div>

                </div>

                <nav>
                    <div className="content_container">
                        <NavLink to="/">All</NavLink>
                        <NavLink to="/books">Books</NavLink>
                        <NavLink to="/manuals">Manuals</NavLink>
                        <NavLink to="/misc">Misc</NavLink>
                    </div>

                </nav>
            </header>

            <div className={`navigation ${navOpen === false ? "closed" : ""} ${navOpen ? "active" : ""}`} ref={divRef}>
                <nav>
                    <div className="navigation-title-bar">
                        <LoginHeader /><IconX className="close-nav-bar" onClick={closeNav} />
                    </div>
                    <NavLink to="item_entry" onClick={closeNav}>Add Manually</NavLink>
                    <NavLink to="/camera_search" onClick={closeNav}>Add by Barcode</NavLink>
                    <NavLink to="/manual_isbn_search" onClick={closeNav}>Search By ISBN</NavLink>
                    <NavLink to="/title_search" onClick={closeNav}>Title Search</NavLink>
                    <NavLink to="/reset_password" onClick={closeNav}>Reset Password</NavLink>
                    <NavLink to="/login" onClick={handleLogout}>Sign Out</NavLink>
                </nav>
            </div>

            <div className="navigation__backdrop"></div>
            {navOpen ? <div className="overlay"></div> : null}

            <main>
                <div className="content_container">
                    <div className="library__container">
                        <CardSelectedProvider>
                            <CustomFetchProvider>
                                <Outlet />
                            </CustomFetchProvider>
                        </CardSelectedProvider>
                    </div>
                </div>

            </main>

            <div className={`show-add-item-menu${openAddItem ? " active" : ""}`} onClick={showAddItemMenu}><IconFilePlus stroke={1.25} />
                <div className={`add-item-menu`}>
                    <NavLink to="/title_search">Title Search</NavLink>
                    <NavLink className="add_item_navlink" to="item_entry">Add Manually</NavLink>
                    <NavLink className="camera_search_navlink" to="/camera_search">Add by Barcode</NavLink>
                    <NavLink className="manual_isbn_search" to="/manual_isbn_search">Search By ISBN</NavLink>
                </div>

            </div>
        </div>
    )
}


