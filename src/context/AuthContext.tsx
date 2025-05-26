import React, { createContext, useContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: true, // Always authenticated for now
  token: 'dummy-token',
  user: { email: 'user@example.com' },
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isLoading: false,
  error: null
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const login = async () => {};
  const register = async () => {};
  const logout = () => {};

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: true,
      token: 'dummy-token',
      user: { email: 'user@example.com' },
      login,
      register,
      logout,
      isLoading: false,
      error: null
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};