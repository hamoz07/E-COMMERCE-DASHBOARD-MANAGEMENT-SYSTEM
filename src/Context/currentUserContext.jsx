// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
// } from "react";
// import { ONEUSERREQ } from "../api/endpoints.js";
// import { AX } from "../api/client.js";

// const CurrentUserContext = createContext(null);

// export const CurrentUserProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userLoading, setUserLoading] = useState(true);
//   const [userError, setUserError] = useState(null);

//   // Added customConfig parameter to merge custom options (like headers, params, etc.) into AX.get
//   const fetchCurrentUser = useCallback(async (signal, onErrorCallback, customConfig = {}) => {
//     setUserLoading(true);
//     setUserError(null);
//     try {
//       const res = await AX.get(`/${ONEUSERREQ}`, { 
//         signal, 
//         ...customConfig // Spread custom config (e.g., headers) here
//       });
//       setCurrentUser(res.data);
//     } catch (err) {
//       if (err.name !== "CanceledError" && err.name !== "AbortError") {
//         if (typeof onErrorCallback === "function") {
//           onErrorCallback();
//           return;
//         }

//         setUserError(err);
//         setCurrentUser(null);
//         console.error("Failed to fetch current user:", err);
//       }
//     } finally {
//       if (!signal.aborted) {
//         setUserLoading(false);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();
//     fetchCurrentUser(controller.signal);

//     return () => controller.abort();
//   }, [fetchCurrentUser]);

//   return (
//     <CurrentUserContext.Provider
//       value={{ 
//         currentUser, 
//         userLoading, 
//         userError, 
//         // Accept optional customConfig as the second argument
//         refetchUser: (onErrorCallback, customConfig) => {
//           const controller = new AbortController();
//           fetchCurrentUser(controller.signal, onErrorCallback, customConfig);
//         },
//         setCurrentUser 
//       }}
//     >
//       {children}
//     </CurrentUserContext.Provider>
//   );
// };

// export const useCurrentUser = () => {
//   const context = useContext(CurrentUserContext);

//   if (context === null) {
//     throw new Error(
//       "useCurrentUser must be used within CurrentUserProvider"
//     );
//   }

//   return context;
// };

// Better version to avoid duplicate fetches and provide a clearCurrentUser function
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { ONEUSERREQ } from "../api/endpoints.js";
import { AX } from "../api/client.js";
import { isAuthenticated } from "../api/auth.js"; // however you currently check for a token

const CurrentUserContext = createContext(null);

export const CurrentUserProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const authenticated = isAuthenticated();

  const {
    data: currentUser,
    isLoading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async ({ signal }) => {
      const res = await AX.get(`/${ONEUSERREQ}`, { signal });
      return res.data;
    },
    enabled: authenticated,   // never fires the request for guests
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 min — avoid refetching on every remount
  });

  const clearCurrentUser = () => {
    queryClient.removeQueries({ queryKey: ["authUser"] });
  };

  CurrentUserProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser: currentUser ?? null,
        userLoading: authenticated ? userLoading : false,
        userError,
        refetchUser,
        clearCurrentUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (context === null) {
    throw new Error("useCurrentUser must be used within CurrentUserProvider");
  }
  return context;
};