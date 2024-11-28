import { createBrowserRouter, Route, Routes, createRoutesFromElements, RouterProvider, Router, BrowserRouter } from "react-router-dom"
// import data from "../data/dbtest.json"
import { QueryClient, QueryClientProvider } from "react-query"

//Layouts
import RootLayout from "./layouts/RootLayout"


//Pages

import CardList from "./components/CardList";

import ItemEntry from "./pages/ItemEntry";
import SearchPage from "./pages/SearchPage";
import ManualISBNSearch from "./pages/ManualISBNSearch";
import { CameraSearch } from "./pages/CameraSearch";
import Login from "./pages/LogIn"
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { TitleSearch } from "./pages/TitleSearch";
import CardDetailsExpanded from "./components/CardDetailsExpanded";
import { ResetPassword } from "./pages/ResetPassword";

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<PrivateRoute />}>
				<Route element={<RootLayout />}>
					<Route index element={<CardList />} />
					<Route path="/books" element={<CardList bookType="Book" />} />
					<Route path="/manuals" element={<CardList bookType="Manual" />} />
					<Route path="/misc" element={<CardList bookType="Misc" />} />
					<Route path="/item_entry" element={<ItemEntry />} />
					<Route path="/search_page" element={<SearchPage />} />
					<Route path="/manual_isbn_search" element={<ManualISBNSearch />}></Route>
					<Route path="/camera_search" element={<CameraSearch />} />
					<Route path="/details/:id" element={<CardDetailsExpanded />} />
					<Route path="/title_search" element={<TitleSearch />} />
				</Route>
			</Route>
			<Route path="/login" element={<Login />} />
			<Route path="/reset_password" element={<ResetPassword />} />
		</>
	)
)



function App() {

	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</QueryClientProvider>

	)
}


export default App
