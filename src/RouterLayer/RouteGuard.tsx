import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAccountStore } from "../OrchestraLayer/StateManager/Zustand/userProfileStore";
import { Box, Typography, Button } from "@mui/material";
import ForbiddenPage from "./ForbiddenPage";

interface RouteGuardProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
    const { account } = useUserAccountStore();

    if (!allowedRoles || allowedRoles.length === 0) {
        return <>{children}</>;
    }

    const hasAccess = allowedRoles.includes(account.role);

    if (!hasAccess) {
        // Option 1: Redirect to login or home
        // return <Navigate to="/home/index" replace />;

        // Option 2: Show an "Access Denied" view
        return (
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                textAlign: "center",
                p: 4,
                bgcolor: "#f8f9fa"
            }}>
                <ForbiddenPage />
            </Box>
        );
    }

    return <>{children}</>;
};

export default RouteGuard;
