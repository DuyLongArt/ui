import React from "react";

// --- Type Definitions ---

// This interface describes a child route within a layout or page
export interface ChildRoute {
    path: string;
    type?: string;
    component: React.ReactNode;
    layout?: React.ReactNode;
    title?: string;
    // isDynamic?: boolean;
    children?: ChildRoute[];
    allowedRoles?: string[];
}

// A base interface that all top-level route objects will extend
interface BaseRoute {
    type: 'redirect' | 'domain' | 'page' | 'error' | 'entry';
}

// Specific type for redirect routes
export interface RedirectRoute extends BaseRoute {
    type: 'redirect';
    host?: string; // Optional host for external redirects
    path: string;
    title?: string;
    children?: ChildRoute[];
    allowedRoles?: string[];
}

// Specific type for standalone routes or layouts
export interface DomainRoute extends BaseRoute {
    type: 'domain';
    path: string;
    component: React.ReactNode;
    children: ChildRoute[];
    title?: string;
    layout?: React.ReactNode;
    allowedRoles?: string[];
}

// Specific type for simple pages
export interface PageRoute extends BaseRoute {
    type: 'page';
    path: string;
    layout?: React.ReactNode;
    component: React.ReactNode;
    children?: ChildRoute[];
    title?: string;
    allowedRoles?: string[];
}
export interface ErrorRoute extends BaseRoute {
    type: 'error';
    path: string;
    layout?: React.ReactNode;
    component: React.ReactNode;
    title?: string;
    children?: ChildRoute[];
    allowedRoles?: string[];
}

// A union type for any possible route object in the array
export type Route = RedirectRoute | DomainRoute | PageRoute | ErrorRoute;