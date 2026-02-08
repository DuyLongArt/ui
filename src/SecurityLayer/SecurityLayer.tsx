import Box from "@mui/material/Box";
import React, { useEffect, useRef, startTransition } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { ChildrenInterface } from "../OrchestraLayer/ChildrenComponent";
import { AuthenticateFactor, checkCookies } from "../OrchestraLayer/StateManager/XState/AuthenticateMachine";
import { useSelector } from "@xstate/react";
import { useUserAccountStore } from "@/OrchestraLayer/StateManager/Zustand/userProfileStore";
import { appRoutes } from "@/RouterLayer/RouterConfig";
import type { Route } from "@/RouterLayer/RouterProtocol";
// import console from "console";

// Constants
const AUTHENTICATED_STATE = "onLogin";
const UNAUTHENTICATED_STATE = "onAuthenFailed";
const LOADING_STATES = ["onInit", "onAuthen", "authenticating", "onTransaction"];
const LOGOUT_STATES = "onLogout";
const REGISTER_STATES = "onGotoEntry";

const ROUTES = {
  HOME: '/home/index',
  LOGIN: '/login/index',
  ENTRY: '/entry/index'
} as const;


console.log("SecurityLayer | App Routes:", appRoutes);

const childrenRoutes = appRoutes.map(element => element.children);
// const allowRoutes = childrenRoutes.map(element => element.);
let allowRoutes: Map<Object, Object>[] = [];
for (let i = 0; i < appRoutes.length; i++) {
  const elementLevel1 = appRoutes[i];
  console.log("Parent path elements", elementLevel1.path);
  if (elementLevel1.children && elementLevel1.children.length > 0) {
    console.log("SecurityLayer | Level 2 children routes PATH:", elementLevel1.children.map(element => element.path));
  } else {
    console.log("SecurityLayer | Level 2 children routes PATH:", elementLevel1.path);
  }
  if (elementLevel1.children) {
    for (let j = 0; j < elementLevel1.children.length; j++) {
      let elementLevel2 = elementLevel1.children[j];
      console.log("SecurityLayer | Level 2 Allows routes PATH:", elementLevel2.allowedRoles);


      //  console.log("SecurityLayer | Level 2 children routes PATH:", elementLevel1.values().);
      allowRoutes.push(new Map([[elementLevel2.allowedRoles, elementLevel1.path]]));
    }
  }
}

let publishRoutes: string[] = [];


console.log("Outer Layer | Allow Routes:", allowRoutes);
// while (allowRoutes.keys().next().value) {
//   let valueOfAllowSetKey = allowRoutes.keys().next().value;
//   console.log("SecurityLayer | Allow Routes Keys:", valueOfAllowSetKey);
//   // if(valueOfAllowSetKey)
// }
allowRoutes.forEach((element) => {
  if (element.keys().next().value) {
    console.log("SecurityLayer | Allow Routes Keys==:", element.keys().next().value.toString().includes("VIEWER"));
    if (element.keys().next().value.toString().includes("VIEWER")) {


      if (element.values().next().value) {
        console.log("===========================");
        console.log("SecurityLayer | Allow Routes:", element);
        console.log("SecurityLayer | Allow Routes Keys:", element.keys().next().value);
        console.log("SecurityLayer | Allow Routes Values:", element.values().next().value);
        publishRoutes.push(element.values().next().value);
      }
    }
  }
})


const SecurityLayer: React.FC<ChildrenInterface> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const authActorRef = AuthenticateFactor.useActorRef();
  const userAccountStore = useUserAccountStore();
  // Track if navigation has already happened to prevent loops
  const hasNavigated = useRef(false);
  const previousState = useRef<string | null>(null);

  // Select state from XState machine
  const currentStateValue = useSelector(authActorRef, (snapshot) => snapshot.value);
  authActorRef.subscribe((snapshot) => {
    console.log("SecurityLayer | State:", snapshot.value);
  })
  const isLoading = useSelector(authActorRef, (snapshot) =>
    LOADING_STATES.some(stateKey => snapshot.matches(stateKey))
  );

  // Reset navigation flag when location changes (user navigates manually)
  useEffect(() => {
    hasNavigated.current = false;
    // userAccountStore.getUserRole();
  }, [location.pathname]);

  // Safe navigation helper with deduplication
  const navigateToRoute = (route: string) => {
    // Prevent navigation if:
    // 1. Already at the target route
    // 2. Already navigated in this render cycle
    // 3. State hasn't actually changed
    if (
      location.pathname === route ||
      hasNavigated.current ||
      previousState.current === currentStateValue
    ) {
      return;
    }

    hasNavigated.current = true;
    previousState.current = currentStateValue as string;

    // Use requestAnimationFrame for smoother navigation
    requestAnimationFrame(() => {
      startTransition(() => {
        navigate(route, { replace: true });
      });
    });
  };
  // var jwtValue ;
  // Handle authentication-based navigation
  useEffect(() => {
    // Function to check JWT from cookies and navigate accordingly
    const checkAuthAndNavigate = async () => {
      try {
        // Check if JWT exists in cookies
        const cookieJWT = checkCookies();
        const hasCookieJWT = !!(cookieJWT && cookieJWT.length > 0);

        // const checkPublicRoutes = location.pathname.startsWith("/" + path);
        let checkPublicRoutes = false;
        publishRoutes.map((element) => {
          if (location.pathname.startsWith("/" + element)) {
            checkPublicRoutes = true;
          }
        })

        console.log("SecurityLayer Check | State:", currentStateValue, " | Loading:", isLoading, " | Cookie JWT:", hasCookieJWT ? "✅" : "❌", " | Path:", location.pathname, " | Public:", checkPublicRoutes);

        // Skip if still loading
        if (isLoading) {
          hasNavigated.current = false;
          return;
        }

        // If no cookies exist and user is trying to access protected routes, redirect to entry
        if (!hasCookieJWT) {
          if (!isPublicPage) {
            console.log("❌ No JWT cookie found on protected route. Redirecting to entry.");
            navigateToRoute(ROUTES.ENTRY);
            return;
          }

        }

        // Handle authenticated state
        if (currentStateValue === AUTHENTICATED_STATE) {
          if (isPublicPage) {
            console.log("✅ Auth passed on public page. Navigating to home.");
            navigateToRoute(ROUTES.HOME);
          }
        }
        // Handle unauthenticated state
        else if (currentStateValue === UNAUTHENTICATED_STATE) {
          if (!isPublicPage) {
            console.log("❌ Auth failed or no JWT on protected route. Navigating to login.");
            navigateToRoute(ROUTES.LOGIN);
          }
        }
        // Handle logout state
        else if (currentStateValue === LOGOUT_STATES) {
          console.log("👋 Logout state. Navigating to entry.");
          navigateToRoute(ROUTES.ENTRY);
        }
      } catch (error) {
        console.error("❌ Error in SecurityLayer auth check:", error);
        navigateToRoute(ROUTES.ENTRY);
      }
    };

    checkAuthAndNavigate();
  }, [currentStateValue, isLoading, location.pathname]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex w-screen h-screen justify-center items-center text-xl text-black bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="border-4 w-20 h-20 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <p>Checking authentication status...</p>
        </div>
      </div>
    );
  }

  // Render logic
  let checkPublicRoutes = false;
  publishRoutes.map((element) => {
    if (location.pathname.startsWith("/" + element)) {
      checkPublicRoutes = true;
    }
  })
  const isPublicPage = location.pathname === '/' ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register') ||
    location.pathname.startsWith('/entry') ||
    checkPublicRoutes;

  if (currentStateValue === AUTHENTICATED_STATE || isPublicPage) {
    return <Box>{children}</Box>;
  }

  // Fallback: wait for navigation or show nothing if unauthorized
  return null;
};

export default SecurityLayer;
