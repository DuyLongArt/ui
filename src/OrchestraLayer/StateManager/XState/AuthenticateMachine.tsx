import { createActorContext } from "@xstate/react";
import { assign, createMachine, type ActorRefFrom, fromPromise } from "xstate";
import axios from 'axios';
import type { RegistrationPayload, RoleTypes } from "../../../DataLayer/Protocol/RegistrationProtocol";

// --- Types ---
const mockDelay = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

type AuthMachineContext = {
  username: string;
  password: string;

  jwt: string;
  success?: string;
  error?: string;
};

// Re-export for backward compatibility
export type { RegistrationPayload, RoleTypes };

type AuthEvents =
  | { type: 'SUBMIT'; username: string; password: string; }
  | { type: 'REGISTER'; payload: RegistrationPayload }
  | { type: 'RETRY' }
  | { type: 'LOGOUT' };

// --- Configuration ---
const ADMIN_MOCK_JWT = false; // Toggle this for testing vs production
const MOCK_JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJxdWFudHVtX2RldyIsIm5hbWUiOiJEdXkgTG9uZyIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTE2MjM5MDIyfQ.4n3f1o3_d3adK3y_sample_signature_verified";

// --- Cookie Utilities ---
const saveJWTToCookies = (jwt: string) => {
  console.log("💾 Saving JWT to cookies..." + jwt);
  if (!jwt || jwt.length === 0) {
    console.warn("Attempted to save empty JWT to cookies");
    return;
  }
  const expiryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
  document.cookie = `auth_jwt=${jwt}; expires=${expiryDate.toUTCString()}; path=/;  Secure;SameSite=Lax`;
  console.log("✅ JWT saved to cookies successfully");
};

const checkCookies = (): string | null => {
  const cookies = document.cookie.split('; ');
  const jwtCookie = cookies.find(row => row.startsWith('auth_jwt='));
  if (jwtCookie) {
    const jwt = jwtCookie.split('=')[1];
    return jwt && jwt.length > 0 ? jwt : null;
  }
  return null;
};


const clearCookies = () => {
  document.cookie = "auth_jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Lax";
  console.log("🧹 JWT cookie cleared.");
};

// --- Services (Side Effects) ---
const getJWT = fromPromise(async () => {
  try {
    if (ADMIN_MOCK_JWT) {
      console.log("⚠️ Using MOCK JWT service.");
      await mockDelay(1000); // Simulate network latency
      return { jwt: MOCK_JWT_TOKEN };
    }
    const token = checkCookies();
    if (token) return { token }; // Return the cookie if we have it
  } catch (error) {
    console.error("❌ Error fetching JWT:", error);
    throw error;
  }
});

const authenticateWithCredentials = fromPromise(
  async ({ input }: { input: { username: string; password: string; jwt?: string; } }) => {
    try {
      // if (ADMIN_MOCK_JWT) {
      //   console.log("⚠️ Using MOCK Login service.");
      //   await mockDelay(1000);
      //   if (input.username === "duylong@duylong.art" && input.password === "duylongadminpass") {
      //     return { jwt: MOCK_JWT_TOKEN };
      //   }
      //   throw new Error("Invalid mock credentials");
      // }

      const response = await axios.post("/backend/auth/login", {
        userName: input.username,
        password: input.password,
        jwt: input.jwt || "", // Include JWT token if available
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error authenticating:", error);
      throw error;
    }
  }
);

const registerWithCredentials = fromPromise(
  async ({ input }: { input: { payload: RegistrationPayload } }) => {
    try {
      if (ADMIN_MOCK_JWT) {
        console.log("⚠️ Using MOCK Register service with payload:", input.payload);
        await mockDelay(1000);
        return { jwt: MOCK_JWT_TOKEN };
      }

      const response = await axios.post("/backend/auth/signup", input.payload);
      console.log("✅ Register response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error registering:", error);
      throw error;
    }
  }
);

// --- State Machine Definition ---
const authenState = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFmAdgZXWXTADoB7HASRwEt0BiAbQAYBdRUABzNjpoo4gAHogBMzAKwkAnBIDMARlEA2OcoDsAFgWa56gDQgAnogAcCkhObXmc06PUa5zUwF9XhtFlwEipCtR0TArsSCDcvOj8OIIiCOJSsooqalo6eoYmCJrK0iSm9vbKppqipnJyohLunhjY+ITE5DgAgnW49BAUpDQ4AG5kANakAGZg6ADGmABSAOoAKiyhXDx8AmFx8qL5EgoS5RJp0goKmWJqJJqOh+qmt8zKEppuHiBe9b5NFG3eOJ3dJF6A2GJDGkxmC0YIUEETWMQ2iC2Oz2ByOJzO2VyJAUlXspVMGjK0hqb3aDT8zR+9XoYAATrSyLSSJwADZEEaMgC2oPGUzmizYMNWUXWoE2lWR+zkh20x1OxkRym2+wksiuoj0TzkJPePkapD6yBZNAgfgAwmQhjQ4C0RsRaQAxXmYJiCsKwkXwsWIBTMdRyS4PUTSXQSeSHDEa5SXeQ4gph5QubWvXXkpqG42m4gWq02u10p3g4LLcLC6KxH1+gOaIMh6XhgwKhC4wNK5TaUzMUqaaTKHVkz7+Vpkh3IGgsyD0PAAVQAQgBZSgCkse8sIhAnPYkZga57qmumCTKDEh0yBgoEnEaYkpgf6ykjscTiD0ABKAFEAOKUPDzd+vpYhUiNdvQ3X1mEuHRfXUSR1CedRpAxJRVXyPY41EKMHmqW9fkHEhaTAKAaFge1eigf4cB6fohlIAiiJIulAPdMtRWEREJUPFFpTReUshOSQSGUJRrEOXZ1Dg7Dalw+86OI0icHIukGSZVl2S5fDCLkxi3RWYDWPFbZOKlGUFDlJDdAsaRTyUDUrHbdR+2kilUyiCYiDIiiqOBUgXJoNziCY3S4QrBAkSM1FZXRJsYIguCVA1DCEIqF4pI+e9fP8jylMZZk2XQDlaW5DK-EC0s9K9NjQo43ZjJ4jF7AsFE7ljK5JNJJz0yNE1zUtQZrVgW17QAGTIIi-lK1d9Mrf1W2DUMGwxdQt3MKpTJDDCNEctKKQzbrs16-rBrpEaxuLIDgvXaDq1rebuPqv0SGudsJBUGCDi2vUKQoE6yAweghBI5z81pAAKcCAEp6FTPDvtG370AmliKriHQ4O3aQ7BxMM7D0Rs+NVdRsWkBDdHUBxHk0NrofvWHTqGgB5T96enZdzs9ELUakZgMfMescfEpC7BIXE4xrbQe2KdxXhwMgIDgQRqb8NmQMqgBaYSMVVxIrKsoSycqXIFAcnDtq+KhaHQZWpuyUQMSuCDfXWkpDjkXtpQ+tMhypXAreRxA1DPW5pCrTRniDzQ7aeQTuYDxwayDj28N2rMwBzPq83tQspl9kL7CkRM9mkeLblM48m1EZ5LmDXINE3HclUTmnh1+Udx0gHPLucaMK4w8XUkqDE1Ag0QFCElV-UvWRG6+nBPzIdAyHfHB0FpLIgvZ9dVbJpDLyJkm9HJp4qbvClZIY2kyI70C1ADIOQ7D0wQyQlRh+KDUYOJ0oi+nppiqiBSr6VRvo9R+987iPwjk2TseQsaygQiPH+BouopzTodYGJ1eiALiHnaOhdi7mF7ItBwIDg7iQQuJISmhEHNAwRVSafsNzOEJjkYoL07jaHgkhLcItpRVC7BhFK7VTZDh+hgLBPpEx5BUEedaJwyZWS4RYbQOgXohjHo4KWrggA */
  id: "authenState",
  types: {} as {
    context: AuthMachineContext;
    events: AuthEvents;
  },
  initial: "onInit",
  context: {
    username: "",
    password: "",
    jwt: "",
    error: undefined,
    success: undefined
  },

  states: {
    // Step 1: Check JWT in cookies
    onInit: {
      entry: () => console.log("🔍 Step 1: Checking for existing JWT in cookies..."),
      always: [
        {
          guard: () => {
            const jwt = checkCookies();
            const hasJWT = jwt !== null && jwt.length > 0;
            console.log(`Cookie check: ${hasJWT ? '✅ JWT found' : '❌ No JWT'}`);
            return hasJWT;
          },
          target: "onLogin",
          actions: [
            assign({
              jwt: () => checkCookies() || ""
            }),
            () => console.log("✅ Using existing JWT from cookies, going to onLogin")
          ]
        },
        {
          target: "onAuthen",
          actions: () => console.log("➡️ No JWT in cookies, proceeding to onAuthen")
        }
      ]
    },

    // Step 2: Fetch JWT from API
    onAuthen: {
      entry: () => {
        console.log("🔍 Step 2: Attempting to fetch JWT from API...");
      },
      invoke: {
        id: "fetchJWT",
        src: getJWT,

        onDone: [
          {
            guard: ({ event }) => {
              const jwt = event.output?.token;
              const hasValidJWT = jwt && jwt.length > 0;
              console.log(`API response: ${hasValidJWT ? '✅ JWT received' : '❌ No valid JWT'}`);
              return hasValidJWT;
            },
            target: "validateCookiesAfterFetch",
            actions: [
              assign({
                jwt: ({ event }) => {
                  const output = event.output;
                  return output?.token || output || "";
                }
              }),
              ({ event }) => {
                const jwt = event.output?.token;
                if (jwt) {
                  console.log("💾 Saving JWT to cookies...");
                  saveJWTToCookies(jwt);
                }
              }
            ]
          },
          {
            target: "onAuthenFailed",
            actions: () => console.log("❌ API returned no valid JWT, going to onAuthenFailed")
          }
        ],
        onError: {
          target: "onAuthenFailed",
          actions: ({ event }) => console.log("❌ API error, going to onAuthenFailed:", event.error)
        }
      }
    },

    // Step 3: Validate JWT was saved to cookies
    validateCookiesAfterFetch: {
      entry: () => console.log("🔍 Step 3: Validating JWT was saved to cookies..."),
      always: [
        {
          guard: () => {
            const jwt = checkCookies();
            const hasJWT = jwt !== null && jwt.length > 0;
            console.log(`Cookie validation: ${hasJWT ? '✅ JWT found in cookies' : '❌ JWT not in cookies'}`);
            return hasJWT;
          },
          target: "onLogin",
          actions: () => console.log("✅ JWT validated in cookies, proceeding to onLogin")
        },
        {
          target: "onAuthenFailed",
          actions: () => console.log("❌ JWT not found in cookies after save, going to onAuthenFailed")
        }
      ]
    },

    // Step 4a: Authentication failed - wait for user credentials
    onAuthenFailed: {
      entry: () => {
        console.log("⚠️ Authentication failed. Waiting for user credentials...");
      },
      on: {
        SUBMIT: {
          target: 'authenticating',
          actions: [
            assign({
              username: ({ event }) => (event as any).username,
              password: ({ event }) => (event as any).password,
              error: undefined
            }),
            () => console.log("📝 User credentials received, starting authentication...")
          ]
        },
        REGISTER: {
          target: 'registering',
          actions: [
            assign({
              username: ({ event }) => (event as any).payload.userName,
              password: ({ event }) => (event as any).payload.password,
              error: undefined
            }),
            () => console.log("📝 Registration credentials received, starting registration...")
          ]
        }
      }
    },

    onGotoEntry: {
      entry: () => console.log("📝 Registering user..."),
    },
    registering: {
      entry: () => console.log("📝 Registering user..."),
      invoke: {
        id: "register",
        src: registerWithCredentials,
        input: ({ event }) => {
          // We need to access the event payload here.
          // Since xstate v5 invoke input can access event, we cast relevant event type
          const registerEvent = event as Extract<AuthEvents, { type: 'REGISTER' }>;
          return {
            payload: registerEvent.payload
          };
        },
        onDone: {
          target: "onInit",
          actions: [
            assign({ success: ({ event }) => (event.output as any)?.message || "Registration Success" }),

          ]
        },
        onError: {
          target: "onAuthenFailed",
          actions: [
            assign({ error: ({ event }) => (event.error as any)?.message || "Registration failed" }),
            ({ event }) => console.log("❌ Registration failed:", event.error)
          ]
        }
      }
    },

    // Step 5: Authenticate with user credentials
    authenticating: {
      entry: () => {
        console.log("🔐 Authenticating with user credentials...");
      },
      invoke: {
        id: "authenticate",
        src: authenticateWithCredentials,
        input: ({ context }) => ({
          username: context.username,
          password: context.password,
          jwt: context.jwt, // Include JWT from context
        }),
        onDone: {
          target: "validateCookiesAfterLogin",
          actions: [
            assign({
              jwt: ({ event }) => {
                const output = event.output;
                return output?.token || output || "";
              }
            }),
            ({ event }) => {
              console.log("✅ Login successful with credentials.");
              const jwt = event.output?.token;
              if (jwt) {
                console.log("💾 Saving JWT to cookies...");
                saveJWTToCookies(jwt);
              }
            }
          ]
        },
        onError: {
          target: "onAuthenFailed",
          actions: [
            assign({ error: ({ event }) => (event.error as any)?.message || "Login failed" }),
            ({ event }) => console.log("❌ Authentication failed:", event.error)
          ]
        }
      }
    },

    // Step 6: Validate JWT after manual login
    validateCookiesAfterLogin: {
      entry: () => console.log("🔍 Validating JWT after login..."),
      always: [
        {
          guard: () => {
            const jwt = checkCookies();
            const hasJWT = jwt !== null && jwt.length > 0;
            console.log(`Cookie validation: ${hasJWT ? '✅ JWT found' : '❌ JWT not found'}`);
            return hasJWT;
          },
          target: "onLogin",
          actions: () => console.log("✅ JWT validated, proceeding to onLogin")
        },
        {
          target: "onAuthenFailed",
          actions: () => console.log("❌ JWT validation failed, returning to onAuthenFailed")
        }
      ]
    },

    // Step 7: Final authenticated state
    onLogin: {
      entry: ({ context }) => {
        console.log("🎉 Authentication successful - Final State Reached.");
        console.log("Current JWT in context:", context.jwt ? "✅ Present" : "❌ Missing");
        const cookieJWT = checkCookies();
        console.log("Current JWT in cookies:", cookieJWT ? "✅ Present" : "❌ Missing");
      },

      on: {
        LOGOUT: {
          target: "onLogout"
        }
      }
    },

    onLogout: {
      entry: [
        () => console.log("👋 Logging out..."),
        clearCookies,
        assign({
          jwt: "",
          username: "",
          password: "",
        })
      ],
      after: {
        100: { target: "onInit" } // Short delay to ensure cleanup feels natural
      }
    }
  }
});

// --- Context and Export ---
export type AuthActorRef = ActorRefFrom<typeof authenState>;

const AuthenticateFactor = createActorContext(authenState);

export { authenState, AuthenticateFactor, getJWT, checkCookies, saveJWTToCookies, clearCookies };