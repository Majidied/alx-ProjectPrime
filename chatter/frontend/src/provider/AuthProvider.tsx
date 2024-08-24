import axios from 'axios';
import {
  createContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

export const AuthContext = createContext<{
  token: string | null;
  setToken: (token: string | null) => void;
} | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken_] = useState<string | null>(
    localStorage.getItem('token')
  );

  const setToken = (newToken: string | null) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
