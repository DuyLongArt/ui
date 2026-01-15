import React from 'react';
import { Box } from '@mui/material';
import RegisterForm from './RegisterForm';

interface RegisterPageProps {
    children?: React.ReactNode;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ children }) => {
    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden"
           
        >
            <RegisterForm />
            {children}
        </div>
    );
};

export default RegisterPage;
