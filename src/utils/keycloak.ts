/**
 * Configures and initializes the Keycloak instance for authentication.
 */
import Keycloak from "keycloak-js";


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

