import axios from 'axios';
import {
  createContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

/**
 * Creates an authentication context that stores the authentication token and a function to set it.
 */
export const AuthContext = createContext<{
  token: string | null;                // The current authentication token or null if not authenticated
  setToken: (token: string | null) => void; // Function to update the authentication token
} | null>(null);

/**
 * AuthProvider component to manage the authentication state and provide it to the rest of the app.
 *
 * @param children - The child components that will have access to the AuthContext.
 * @returns A React component that provides authentication state to its children.
 */
const AuthProvider = ({ children }: { children: ReactNode }) => {
  // State to hold the authentication token, initially retrieved from localStorage
  const [token, setToken_] = useState<string | null>(
    localStorage.getItem('token')
  );

  /**
   * Function to update the authentication token in state and localStorage.
   *
   * @param newToken - The new authentication token or null to remove it.
   */
  const setToken = (newToken: string | null) => {
    setToken_(newToken);
  };

  /**
   * Effect that runs whenever the token state changes.
   * It sets or removes the authorization header in axios and updates localStorage.
   */
  useEffect(() => {
    if (token) {
      // Set the authorization header for axios requests if the token is present
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      localStorage.setItem('token', token);
    } else {
      // Remove the authorization header and token from localStorage if the token is null
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  /**
   * Memoized value of the context to avoid unnecessary re-renders.
   */
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
