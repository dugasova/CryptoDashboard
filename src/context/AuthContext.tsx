import React, { createContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Placeholder for actual login logic (e.g., API call)
    console.log('Attempting login with:', username, password);
    if (username === 'user' && password === 'password') {
      setIsAuth(true);
      return true;
    }
    return false;
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    // Placeholder for actual registration logic (e.g., API call)
    console.log('Attempting registration with:', username, password);
    // Simulate successful registration
    return true;
  };

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
