/**
 * Configures and initializes the Keycloak instance for authentication.
 */
import Keycloak from "keycloak-js";
//https://www.keycloak.org/securing-apps/javascript-adapter
//https://dev.to/saltorgil/react-keycloak-integration-secure-auth-for-existing-backend-182b
//ρυθμίσεις από env

// Instantiate Keycloak once, pointing at your realm and SPA client
export const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export const initOptions = {
    onLoad: 'login-required',
    flow: 'standard',                         // openID standard flow
    pkceMethod: 'S256',                       // για να μην κλαπεί το token
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`, //το html του silent sso check
    checkLoginIframe: false,                   // ανανέωση token (θα γίνει από το axios interceptor
    enableLogging: true,                      // logging
};

