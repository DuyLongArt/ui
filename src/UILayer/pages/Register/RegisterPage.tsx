import React from 'react';
import { Box } from '@mui/material';
import RegisterForm from './RegisterForm';

interface RegisterPageProps {
    children?: React.ReactNode;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ children }) => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                minWidth: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
        >
            <RegisterForm />
            {children}
        </Box>
    );
};

export default RegisterPage;
