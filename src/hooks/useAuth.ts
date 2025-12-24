import { useKeycloak } from "@react-keycloak/web";
import type {UserInfoProps} from "@/types.ts";
import {useCallback, useMemo} from "react";

//authentication state
const useAuth = () => {

    const {keycloak, initialized} = useKeycloak(); //instance με ολες τις μεθόδους από τη βιβλιοθήκη login,logout, token

    const isAuthenticated = initialized && keycloak.authenticated; //o user κάνει login μόνο αν το Keycloak ειναι Initialized και ο user ειναι authenticated

    // Εξαγωγή User Info από το JWT Token
    // αντιστοίχιση JWT claims σε UserInfoProps
    //χωρις το useMemo πέφτω σε loop rerender γιατί στο select project page κανει render, δημιουργεί νέο userInfo και θεωρεί ότι αλλάζει συνέχεια! Το memo το κρατάει και επιστρέφει ίδιο object.
    //βλέπω το memo στο Inspect/components SelectProjectsPage hooks/auth/
    const userInfo: UserInfoProps = useMemo(() => ({
        keycloakId: keycloak.tokenParsed?.sub,
        username: keycloak.tokenParsed?.preferred_username,
        email: keycloak.tokenParsed?.email,
        lastname: keycloak.tokenParsed?.family_name,
        firstname: keycloak.tokenParsed?.given_name,
        name: keycloak.tokenParsed?.name,
        role: keycloak.tokenParsed?.role
    }), [keycloak.tokenParsed]); //υπολογισμός μονο αν αλλάξει το keycloak.tokenParsed

    //USER LOGIN Keycloak.login
    const login = useCallback(() => { //callback για να μη καλεί ξανά το function σε κάθε render, παρά μόνο αν αλλάξει το instance
        keycloak.login({
            redirectUri: window.location.origin, //αν οκ redirect dev και production
        });
    }, [keycloak]);

    //USER LOGOUT Keycloak.logout
    const logout = useCallback(() => {
        keycloak.logout({
            redirectUri: window.location.origin, //αν logout redirect στο login page
        });
    }, [keycloak]);

    //ΕΛΕΓΧΟΣ ΡΟΛΟΥ
    const hasRole = useCallback((role: string) => {
        return keycloak.tokenParsed?.role === role;
    }, [keycloak]);

    //ΕΛΕΓΧΟΣ ΑΝ Ο ΧΡΗΣΤΗΣ ΕΧΕΙ ΕΝΑΝ ΑΠΟ ΤΟΥΣ ΡΟΛΟΥΣ ΠΟΥ ΕΠΙΤΡΕΠΟΝΤΑΙ
    const hasAnyRole = useCallback((roles: string[]) => {
        return roles.includes(keycloak.tokenParsed?.role);
        }, [keycloak]);

    return {
        isAuthenticated, //true αν authenticated
        isInitialized: initialized, //true αν το keycloak έχει γίνει initialized
        token: keycloak.token, //JWT access token
        userInfo, // Όλα τα user data από το token
        login, // Redirect σε Keycloak login
        logout, // Logout και redirect σε Keycloak login

        // Authorization
        hasRole, //Έλεγχος για συγκεκριμένο role
        hasAnyRole, //Έλεγχος για έναν από πολλούς roles. Για τον ελεγχο στο dashboard. να μη βαζω ενα ενα
    };
};

export default useAuth