import { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';

/**
 * Custom hook to access the authentication context.
 *
 * @returns The current authentication context, including the token and the setToken function.
 * @throws An error if the hook is used outside of an AuthProvider.
 */
export const useAuth = () => {
  // Retrieve the authentication context using useContext
  const context = useContext(AuthContext);

  // If the context is null, it means that useAuth is being used outside of an AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Return the context, which contains the authentication token and setToken function
  return context;
};
