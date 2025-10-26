import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./layout/Dashboard.tsx";
import HomePage from "./components/pages/HomePage.tsx";
import Cropper from "./components/Cropper.tsx";
import {ThemeProvider} from "@mui/material";
import theme from "./theme.ts";

function App() {


  return (
    <>

        <ThemeProvider theme={theme}>
        <BrowserRouter>
            <Routes>
                <Route element={<Dashboard/>}>
                    <Route index element={<HomePage />}/>
                    <Route path="/cropper" element={<Cropper />}/>
                    {/*<Route path="/projects" element={<ImageToolbar />}/>*/}

                </Route>
            </Routes>
        </BrowserRouter>
        </ThemeProvider>

    </>
  )
}

export default App
