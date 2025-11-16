import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./layout/Dashboard.tsx";
import HomePage from "./components/pages/HomePage.tsx";
import Cropper from "./components/Cropper.tsx";
import {ThemeProvider} from "@mui/material";
import theme from "./theme.ts";
import ProtectedRoute from "@/ui/ProtectedRoute.tsx";

function App() {


    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Dashboard />}>
                            {/* Οι authenticated users */}
                            <Route index element={<HomePage />} />
                            <Route path="/cropper" element={<Cropper />} />

                            {/*Admin και Manager μόνο*/}
                            <Route element={<ProtectedRoute roles={['Admin', 'Manager']} />}>
                                {/*TODO: να μπει το Users, Projects, Prompts*/}
                            </Route>

                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;