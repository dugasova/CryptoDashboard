import React, { createContext, useState, type ReactNode } from 'react';
import {
  registerUser,
  verifyUser,
  userExists,
  saveSession,
  clearSession,
  getSession,
} from '../services/authStorage';

interface AuthContextType {
  isAuth: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(() => {
    const savedUsername = getSession();
    return !!savedUsername && userExists(savedUsername);
  });
  const [username, setUsername] = useState<string | null>(() => {
    const savedUsername = getSession();
    return savedUsername && userExists(savedUsername) ? savedUsername : null;
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    const success = await verifyUser(username, password);
    if (success) {
      setIsAuth(true);
      setUsername(username);
      saveSession(username);
    }
    return success;
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    const success = await registerUser(username, password);
    if (success) {
      setIsAuth(true);
      setUsername(username);
      saveSession(username);
    }
    return success;
  };

  const logout = () => {
    setIsAuth(false);
    setUsername(null);
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ isAuth, username, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
