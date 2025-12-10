import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "@/components/layout/Dashboard.tsx";
import HomePage from "./components/pages/HomePage.tsx";
import {ThemeProvider} from "@mui/material";
import theme from "./theme.ts";
import ProtectedRoute from "@/components/ui/ProtectedRoute.tsx";
import UserPage from "@/components/pages/UserPage.tsx";
import UsersPage from "@/components/pages/UsersPage.tsx";
import ProjectsPage from "@/components/pages/ProjectsPage.tsx";
import ProjectPage from "@/components/pages/ProjectPage.tsx";
import ProjectMapPage from "@/components/pages/ProjectMapPage.tsx";
import PromptsPage from "@/components/pages/PromptsPage.tsx";
import PromptPage from "@/components/pages/PromptPage.tsx";
import SelectProjectPage from "@/components/pages/SelectProjectPage.tsx";
import ConversionJob from "@/components/pages/ConversionJob.tsx";

function App() {


    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Dashboard />}>
                            {/* Οι authenticated users */}
                            <Route index element={<HomePage />} />
                            <Route path="/select-project" element={<SelectProjectPage />} />
                            <Route path={"/projects/:projectId/cropper"} element={<ConversionJob />}/>

                            {/*Admin και Manager μόνο*/}
                            <Route element={<ProtectedRoute roles={['Admin', 'Manager']} />}>
                                <Route path="/users" element={<UsersPage />} />
                                {/*create*/}
                                <Route path="/users/new" element={<UserPage />} />
                                {/*edit*/}
                                <Route path="/users/:userId" element={<UserPage />} />

                                <Route path="/projects" element={<ProjectsPage />} />
                                {/*/!*create*!/*/}
                                <Route path="/projects/new" element={<ProjectPage />} />
                                {/*/!*edit*!/*/}
                                <Route path="/projects/:projectId" element={<ProjectPage />} />
                                {/*/!*map view*!/*/}
                                <Route path="/projects/:projectId/map" element={<ProjectMapPage />} />

                                <Route path="/prompts" element={<PromptsPage />} />
                                {/*/!*create*!/*/}
                                <Route path="/prompts/new" element={<PromptPage />} />
                                {/*/!*edit*!/*/}
                                <Route path="/prompts/:promptId" element={<PromptPage />} />


                            </Route>

                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;