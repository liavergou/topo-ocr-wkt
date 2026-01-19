import { useKeycloak } from "@react-keycloak/web";
import type {UserInfoProps} from "@/types.ts";
import {useCallback, useMemo} from "react";

/**
 * Custom hook for managing Keycloak authentication, user state and role-based access control.
 * @returns Authentication state, user info, login/logout functions, and role checking utils
 */
const useAuth = () => {

    const {keycloak, initialized} = useKeycloak();

    const isAuthenticated = initialized && keycloak.authenticated;

    const userInfo: UserInfoProps = useMemo(() => ({
        keycloakId: keycloak.tokenParsed?.sub,
        username: keycloak.tokenParsed?.preferred_username,
        email: keycloak.tokenParsed?.email,
        lastname: keycloak.tokenParsed?.family_name,
        firstname: keycloak.tokenParsed?.given_name,
        name: keycloak.tokenParsed?.name,
        role: keycloak.tokenParsed?.role
    }), [keycloak.tokenParsed]);

    const login = useCallback(() => {
        keycloak.login({
            redirectUri: window.location.origin,
        });
    }, [keycloak]);

    const logout = useCallback(() => {
        keycloak.logout({
            redirectUri: window.location.origin,
        });
    }, [keycloak]);

    const hasRole = useCallback((role: string) => {
        return keycloak.tokenParsed?.role === role;
    }, [keycloak]);

    const hasAnyRole = useCallback((roles: string[]) => {
        return roles.includes(keycloak.tokenParsed?.role);
        }, [keycloak]);

    return {
        isAuthenticated,
        isInitialized: initialized,
        token: keycloak.token,
        userInfo,
        login,
        logout,
        hasRole,
        hasAnyRole,
    };
};

export default useAuth