import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAccountStore } from "../OrchestraLayer/StateManager/Zustand/userProfileStore";
import { Box, Typography, Button } from "@mui/material";

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
                <Typography variant="h2" color="error" gutterBottom sx={{ fontWeight: 'bold' }}>
                    403
                </Typography>
                <Typography variant="h4" gutterBottom>
                    Access Denied
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                    You don't have permission to access this page. Your current role is <strong>{account.role}</strong>.
                </Typography>
                <Button variant="contained" onClick={() => window.location.href = "/home/index"}>
                    Go Back Home
                </Button>
            </Box>
        );
    }

    return <>{children}</>;
};

export default RouteGuard;
