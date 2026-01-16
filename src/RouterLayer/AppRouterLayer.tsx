import React, { Suspense, useEffect } from "react";
import { Navigate, useRoutes, type RouteObject } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import type { ChildrenInterface } from "../OrchestraLayer/ChildrenComponent";
import { appRoutes, errorRoute } from "./RouterConfig.tsx";
import type { Route as RouteType, ChildRoute, RedirectRoute, DomainRoute, PageRoute } from "./RouterProtocol.ts";
import RouteGuard from "./RouteGuard.tsx";

// --- Helpers ---

const PageLoader = () => (
  <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", gap: 2 }}>
    <CircularProgress />
    <Box>Loading page...</Box>
  </Box>
);

// Handles redirects to external sites (like your 192.168... links)
const ExternalRedirect = ({ url }: { url: string }) => {
  useEffect(() => { window.location.href = url; }, [url]);
  return <PageLoader />;
};

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const transformRoutes = (routes: (RouteType | ChildRoute)[]): RouteObject[] => {
  if (!routes) return [];

  return routes.map((route) => {
    // 1. Handle Redirects
    if (route.type === 'redirect') {
      const redirectRoute = route as RedirectRoute;
      if (redirectRoute.host) {
        const fullUrl = redirectRoute.host.startsWith('http')
          ? redirectRoute.host
          : `http://${redirectRoute.host}${redirectRoute.path}`;
        return {
          path: redirectRoute.path,
          element: <ExternalRedirect url={fullUrl} />
        };
      }
      return {
        path: redirectRoute.path,
        element: <Navigate to={redirectRoute.path} replace />
      };
    }

    // 2. Handle Standard Routes (Domain/Page/Component)
    const pageRoute = route as DomainRoute | PageRoute;
    let element = pageRoute.component;

    // Apply Layout if exists
    if (pageRoute.layout) {
      element = React.cloneElement(
        pageRoute.layout as React.ReactElement,
        {},
        pageRoute.component
      );
    }

    // Wrap with RouteGuard if roles are specified
    if (pageRoute.allowedRoles && pageRoute.allowedRoles.length > 0) {
      element = (
        <RouteGuard allowedRoles={pageRoute.allowedRoles}>
          {element}
        </RouteGuard>
      );
    }

    const hasChildren = pageRoute.children && pageRoute.children.length > 0;
    const childrenObjects = hasChildren ? transformRoutes(pageRoute.children!) : [];

    // Auto-Redirect to first child if children exist (Index Route logic)
    if (hasChildren && pageRoute.children![0]) {
      childrenObjects.push({
        index: true,
        element: <Navigate to={pageRoute.children![0].path} replace />
      });
    }

    return {
      path: pageRoute.path,
      element: <SuspenseWrapper>{element}</SuspenseWrapper>,
      children: childrenObjects
    };
  });
};

// --- Main Component ---

const AppRouterLayer: React.FC<ChildrenInterface> = ({ children }) => {
  // Combine appRoutes and errorRoute
  const allRoutes = [...appRoutes];
  if (errorRoute) {
    allRoutes.push(errorRoute);
  }

  const routesElement = useRoutes(transformRoutes(allRoutes));

  return (
    <div className="h-full w-full overflow-x-hidden">
      {routesElement}
      {children}
    </div>
  );
};

export default AppRouterLayer;