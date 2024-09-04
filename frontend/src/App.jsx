import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom"
// import data from "../data/dbtest.json"
import { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"

//Layouts
import RootLayout from "./layouts/RootLayout"

//Pages

import All from "./pages/All";
import Books from "./pages/Books";
import Manuals from "./pages/Manuals";
import Misc from "./pages/Misc";
import ItemEntry from "./pages/ItemEntry";
import SearchPage from "./pages/SearchPage";
import ManualISBNSearch from "./pages/ManualISBNSearch";
import { CameraSearch } from "./pages/CameraSearch";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<All />} />
      <Route path="/books" element={<Books />} />
      <Route path="/manuals" element={<Manuals />} />
      <Route path="/misc" element={<Misc />} />
      <Route path="/item_entry" element={<ItemEntry />} />
      <Route path="/search_page" element={<SearchPage />} />
      <Route path="/manual_isbn_search" element={<ManualISBNSearch />}></Route>
      <Route path="/camera_search" element={<CameraSearch />} />
    </Route>
  )
)



function App() {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>

  )
}

export default App
