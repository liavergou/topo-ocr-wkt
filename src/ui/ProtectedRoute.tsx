import { Outlet } from 'react-router';
import useAuth from '@/hooks/useAuth';
import { Typography } from '@mui/material';
import type {ProtectedRouteProps} from "@/types.ts";

const ProtectedRoute= ({roles}:ProtectedRouteProps) => {


    const { isAuthenticated, hasAnyRole, login } = useAuth();

    //ΕΛΕΓΧΟΣ AUTHENTICATION
    if (!isAuthenticated) {
        login(); // Redirect στο Keycloak login
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