import { Outlet } from 'react-router';
import useAuth from '@/hooks/useAuth';
import {CircularProgress, Typography} from '@mui/material';
import type {ProtectedRouteProps} from "@/types.ts";

/**
 * Protected route wrapper that handles authentication and role-based authorization
 * Used in: App routing configuration
 * @param roles - array of permitted roles
 */
const ProtectedRoute= ({roles}:ProtectedRouteProps) => {


    const { isAuthenticated, hasAnyRole, login } = useAuth();


    //ΕΛΕΓΧΟΣ AUTHENTICATION
    if (!isAuthenticated) {
        login(); // Redirect στο Keycloak login
        return <CircularProgress/>; //
    }

    //ΕΛΕΓΧΟΣ AUTHORIZATION
    if (roles && roles.length > 0) { //να εχουν ορισθεί επιτρεπόμενοι ρόλοι
        if (!hasAnyRole(roles)) { //να έχει τουλάχιστον ένα απο τους επιτρεπόμενους ρόλους
            return (
                    <Typography variant="h5" color="error">
                        You are not authorized to access this page
                    </Typography>
            );
        }
    }

    //αν ολα οκ εμφάνιση component
    return <Outlet />;
};

export default ProtectedRoute;