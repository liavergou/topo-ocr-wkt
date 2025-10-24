import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./layout/Dashboard.tsx";
import HomePage from "./components/pages/HomePage.tsx";
import Cropper from "./components/Cropper.tsx";
function App() {


  return (
    <>


        <BrowserRouter>
            <Routes>
                <Route element={<Dashboard/>}>
                    <Route index element={<HomePage />}/>
                    <Route path="/cropper" element={<Cropper />}/>

                </Route>
            </Routes>
        </BrowserRouter>

    </>
  )
}

export default App
