// import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from "react";
// import { loginProvider, logoutProvider, getLoggedUser } from "../api/auth";

// type UserRole = "ROLE_PROVIDER" | "ROLE_ADMIN" | "ROLE_CUSTOMER";

// export interface User {
//   id: number;
//   email: string;
//   role: UserRole;
//   name?: string;
//   avatar?: string;
//   location?: string;
//   emailVerified?: boolean;
//   businessName?: string;
//   businessDescription?: string;
//   logoUrl?: string;
//   profilePictureUrl?: string;
//   status?: string;
// }

// interface AuthContextValue {
//   user: User | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   error: string | null;
//   loginAttempts: number;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   updateUser: (changes: Partial<User>) => void;
//   clearError: () => void;
// }

// const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// const authLogger = {
//   info: (message: string, data?: unknown) => {
//     if (process.env.NODE_ENV !== "production") {
//       console.log(`[Auth] ${message}`, data);
//     }
//   },
//   warn: (message: string, data?: unknown) => {
//     console.warn(`[Auth] ${message}`, data);
//   },
//   error: (message: string, data?: unknown) => {
//     console.error(`[Auth] ${message}`, data);
//   },
// };

// function isUser(data: unknown): data is User {
//   return (
//     typeof data === "object" &&
//     data !== null &&
//     "id" in data &&
//     "email" in data &&
//     "role" in data
//   );
// }

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [loginAttempts, setLoginAttempts] = useState(0);
//   const [lastAttemptTime, setLastAttemptTime] = useState<number | null>(null);
//   const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
//   const isMounted = useRef(true);

//   useEffect(() => {
//     isMounted.current = true;
//     return () => { isMounted.current = false; };
//   }, []);

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const data = await getLoggedUser();
//         if (isUser(data)) {
//           if (isMounted.current) setUser(data);
//           authLogger.info("Active session found", { user: data });
//         } else {
//           throw new Error("Invalid user data received");
//         }
//       } catch (err) {
//         authLogger.warn("No active session found", { error: err });
//         if (isMounted.current) setUser(null);
//       } finally {
//         if (isMounted.current) setIsLoading(false);
//       }
//     };

//     checkSession();
//   }, []);

//   const clearError = () => setError(null);

//   const handleError = (err: unknown) => {
//     const message = err instanceof Error ? err.message : "An unknown error occurred";
//     setError(message);
//     authLogger.error("Authentication error", { error: err });
//     return message;
//   };

//   const resetInactivityTimer = () => {
//     if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
//     inactivityTimer.current = setTimeout(() => {
//       if (user) {
//         authLogger.info("User inactive, logging out");
//         logout();
//       }
//     }, 30 * 60 * 1000); // 30 min
//   };

//   useEffect(() => {
//     if (user) {
//       window.addEventListener("mousemove", resetInactivityTimer);
//       window.addEventListener("keydown", resetInactivityTimer);
//       resetInactivityTimer();
//     }
//     return () => {
//       window.removeEventListener("mousemove", resetInactivityTimer);
//       window.removeEventListener("keydown", resetInactivityTimer);
//       if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
//     };
//   }, [user]);

//   useEffect(() => {
//     const handleForceLogout = () => {
//       authLogger.info("Forced logout due to session invalidation");
//       if (isMounted.current) setUser(null);
//     };
//     window.addEventListener("forceLogout", handleForceLogout);
//     return () => {
//       window.removeEventListener("forceLogout", handleForceLogout);
//     };
//   }, []);

//   const login = async (email: string, password: string) => {
//     const now = Date.now();

//     if (lastAttemptTime && now - lastAttemptTime > 5 * 60 * 1000) {
//       setLoginAttempts(0);
//     }

//     if (loginAttempts >= 5) {
//       const message = "Too many login attempts. Please try again later.";
//       setError(message);
//       throw new Error(message);
//     }

//     try {
//       setIsLoading(true);
//       clearError();
//       authLogger.info("Login attempt", { email });

//       // Call loginProvider and expect it returns token info
//       const loginData = await loginProvider(email, password);
//       if (!loginData || !loginData.jwtToken) throw new Error("Login failed: token missing");

//       // Fetch full user profile
//       const profileData = await getLoggedUser();
//       if (!isUser(profileData)) throw new Error("Invalid user data received");

//       if (profileData.role !== "ROLE_PROVIDER") {
//         throw new Error("Only providers are allowed");
//       }

//       if (isMounted.current) {
//         setUser(profileData);
//         setLoginAttempts(0);
//       }

//       authLogger.info("Login + profile fetch successful", { user: profileData });

//     } catch (err) {
//       if (isMounted.current) {
//         setLoginAttempts(prev => prev + 1);
//         setLastAttemptTime(now);
//       }
//       const msg = handleError(err);
//       throw new Error(msg);
//     } finally {
//       if (isMounted.current) setIsLoading(false);
//     }
//   };

//   const logout = async () => {
//     authLogger.info("Logout initiated");
//     try {
//       await logoutProvider();
//     } catch (err) {
//       authLogger.warn("Logout API failed", { error: err });
//     } finally {
//       if (isMounted.current) setUser(null);
//       authLogger.info("User logged out");
//     }
//   };

//   const updateUser = (changes: Partial<User>) => {
//     setUser(prev => {
//       if (!prev) {
//         authLogger.warn("Attempted user update with no user logged in");
//         return null;
//       }
//       const updated = { ...prev, ...changes };
//       authLogger.info("User updated", { previous: prev, updated });
//       return updated;
//     });
//   };

//   const contextValue = useMemo(() => ({
//     user,
//     isLoading,
//     isAuthenticated: !!user,
//     error,
//     loginAttempts,
//     login,
//     logout,
//     updateUser,
//     clearError,
//   }), [user, isLoading, error, loginAttempts]);

//   return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   authLogger.info("useAuth hook called");
//   return ctx;
// };