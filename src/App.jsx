import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom"
import './App.css'

//Layouts
import RootLayout from "./layouts/RootLayout"

//Pages

import All from "./pages/All";
import Books from "./pages/Books";
import Manuals from "./pages/Manuals";
import Misc from "./pages/Misc";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<All />} />
      <Route path="books" element={<Books />} />
      <Route path="manuals" element={<Manuals />} />
      <Route path="misc" element={<Misc />} />
    </Route>
  )
)

function App() {


  return (
    <RouterProvider router={router} />
  )
}

export default App
