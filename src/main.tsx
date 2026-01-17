import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
//import {StrictMode} from "react";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {initOptions, keycloak} from "@/utils/keycloak.ts";


createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    //authentication
    <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={initOptions}
        LoadingComponent={<div className="text-6xl text-center mt-40 text-gray-500">Loading...</div>}
        >

        <App />

        </ReactKeycloakProvider>
    // </StrictMode>
)
