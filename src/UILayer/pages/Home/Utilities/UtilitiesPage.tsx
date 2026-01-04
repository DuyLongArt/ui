// pages/UtilitiesPage.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const UtilitiesPage = () => {
    return (
        <div className="p-4 md:p-8 bg-white min-h-screen">
            <Outlet />
        </div>
    );
};

export default UtilitiesPage;