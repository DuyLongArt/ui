import { lazy } from "react";
// Eager loaded core/type components
import type { Route } from "./RouterProtocol";

// Lazy load components
const EntryPage = lazy(() => import("../UILayer/pages/Public/EntryPage.tsx"));
const LoginIndex = lazy(() => import("../UILayer/pages/Login/LoginIndex.tsx"));
const LoginForm = lazy(() => import("../UILayer/pages/Login/LoginForm.tsx"));
const RegisterPage = lazy(() => import("../UILayer/pages/Register/RegisterPage.tsx"));
const HomePage = lazy(() => import("../UILayer/pages/Home/HomePage.tsx"));
const HomeLayout = lazy(() => import("../UILayer/pages/Home/HomeLayout.tsx"));
const WidgetMainPage = lazy(() => import("../UILayer/pages/Home/Widget/WidgetMainPage.tsx"));
const PersonProfilePage = lazy(() => import("../UILayer/pages/Admin/PersonProfilePage.tsx"));
const IOTPage = lazy(() => import("../UILayer/pages/Home/IOT/IOTPage.tsx"));

// New lazy loads
const NotFoundPage = lazy(() => import("../UILayer/pages/Error/NotFoundPage.tsx"));
const OutletLayout = lazy(() => import("../UILayer/pages/Home/OutletLayout.tsx"));
const IOTMap = lazy(() => import("../UILayer/pages/Home/IOT/IOTMap.tsx").then(m => ({ default: m.IOTMap })));
const StoragePage = lazy(() => import("../UILayer/pages/Home/Utilities/StoragePage.tsx").then(m => ({ default: m.StoragePage })));
const UtilitiesPage = lazy(() => import("../UILayer/pages/Home/Utilities/UtilitiesPage.tsx"));
const UtilitiesDashboardPage = lazy(() => import("../UILayer/pages/Home/Utilities/UtilitiesDashboardPage.tsx"));
const PersonalPage = lazy(() => import("../UILayer/pages/Home/Person/PersonalPage.tsx"));
const AdminOverviewPage = lazy(() => import("../UILayer/pages/Admin/AdminOverviewPage.tsx"));

// Placeholder for BlankPage if it's not exported elsewhere
const BlankPage = () => (
    <div style={{ padding: 20 }}>
        <h1>This is a blank page</h1>
    </div>
);

export const appRoutes: Route[] = [
    {
        type: "redirect",
        host: "192.168.3.1:6699",
        path: "/apps/dashboard/",
        title: "nextcloud",
    },
    {
        type: "domain",
        path: "/login",
        component: <OutletLayout />,
        title: "Login Domain",
        children: [
            {
                path: "form",
                component: <LoginForm />,
                title: "Form",
            },
            {
                type:"entry",
                path: "index",
                component: <LoginIndex />,
                title: "Login",
            },
            {
                path: "register",
                component: <RegisterPage />,
                title: "Register",
            },
        ],
    },
    {
        type: "domain",
        path: "entry",
        component: <OutletLayout />,
        title: "Entry",
        children: [
            {
                type: "entry",
                path: "index",
                component: <EntryPage />,
                title: "Welcome",
            }
        ]
    },
    
    {
        type: "domain",
        path: "home",
        component: <HomeLayout />,
        title: "HOME",
        children: [
            {
            type: "entry",
                path: "index",
                component: <HomePage />,
                title: "Home",
                children: [
                    
                ]
        },
    
    ]
    },
     {
               
            
            
                    type: "domain",
                path: "IOT",
                component: <OutletLayout />,
                title: "IOT",
                children: [
                           {
            type: "component",
                path: "index",
                component: <IOTPage />,
                // title: "IOT",
                children: [
                  {type:"component",path:"blank",component:<BlankPage />}
                ],
                
        },
          {
                        type: "component",
                        path: "map",
                        component: <IOTMap />,
                        title: "Map",
                    }
                ]
            },
            {
                    type: "domain",
                path: "personal",
                component: <HomeLayout />,
                title: "Personal",
                allowedRoles: ["ADMIN","USER"],
                children: [
                    {
                type: "entry",
                path: "index",
                component: <PersonalPage />,
                title: "Personal",
                children: [
                    
                ]
                    }
                ]
            },
            {
                type: "domain",
                path: "superuser",
                component: <HomeLayout />,
                title: "Superuser",
                allowedRoles: ["ADMIN","USER"],
                children: [
                    {
                        type: "entry",
                        path: "index",
                        component: <AdminOverviewPage />,
                        title: "Superuser Overview",
                    }
                ]
            },
            {
                    type: "domain",
                path: "widget",
                component: <HomeLayout />,
                title: "Widget",
                children: [
                    {
                            type: "entry",
                path: "index",
                component: <WidgetMainPage />,
                title: "Widget",
                children: [
                    
                ]
                    }
                ]
            },
           
    {
        type: "domain",
        path: "admin",
        component: <HomeLayout /> ,// Was AdminLayout, effectively Outlet in old map
        title: "Admin",
        children: [
            {
                path: "person-profile",
                component: <PersonProfilePage />,
                title: "Person Profile",
            },
        ],
    },
  
    {
        type: "domain",
        path: "utilities",
        component: <HomeLayout />, // Was WidgetLayout, effectively Outlet
        title: "Unity",
        children: [
            {
                path: "index",
                component: <UtilitiesPage />,
                title: "Storage",
                children: [
              
                    {
                        type:"component",
                        path: "storage",
                        // layout: <HomeLayout />,
                        component: <StoragePage />,
                        title: "Storage",
                        children: [
                            
                        ]
                    }
                ]
            },
           /* {
                path: "1",
                component: <Widget1Page />,
                title: "Widget 1",
            },
            {
                path: "2",
                component: <Widget2Page />,
                title: "Lab waves",
            },
            {
                path: "3",
                component: <Widget3Page />,
                title: "Retro terminal",
            },
            {
                path: "4",
                component: <Widget4Page />,
                title: "VHS Page",
            },
            {
                path: "5",
                component: <Widget5Page />,
                title: "Yellow City",
            },*/
        ],
    },
    {
        type: "page",
        path: "process-approval",
        component: <OutletLayout />,
        title: "Process Approval",
        children: [
            /*{
                path: "index",
                component: <ApproveProcessPage />,
                title: "Process Approval",
            }*/
        ]
    },
    {
        type: 'error',
        path: '/*',
        component: <NotFoundPage />
    }
];
export const errorRoute = appRoutes.find(r => r.type === 'error');
// Helper to get raw paths/titles for legacy components (like HomeLayout/ResponsiveAppbar)
// const homeRoute = appRoutes.find(r => r.path === '/home' && r.type === 'domain');
// export const pathList = homeRoute?.children?.map(child => child.path) || [];
// export const pageList = homeRoute?.children?.map(child => child.title || child.path) || [];


// export const pathList = appRoutes.map(r=>r.children.find(r=>r.type==="domain")?.path);
// export const pathList =appRoutes.map(r=>r.type);

// export const pathList=appRoutes.map(r=>
// {
//     if(r.find(t=>t.type==="domain"))
//         return r.find(r=>r.type==="domain")?.path;
//     else return "";
// });

 
// export const pageList = appRoutes.map(r=>r.children.find(r=>r.type==="domain")?.title);