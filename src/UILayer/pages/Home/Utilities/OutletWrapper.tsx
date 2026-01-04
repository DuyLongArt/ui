// components/OutletWrapper.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * A simple wrapper for intermediate routes.
 * It allows children to render infinitely deeper.
 */
const OutletWrapper: React.FC = () => {
    return (
        <div className="w-full h-full">
            <Outlet />
        </div>
    );
};

export default OutletWrapper;