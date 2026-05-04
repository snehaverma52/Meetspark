import { createContext, useContext, ReactNode } from "react";

interface AuthContextType {
  user: null;
  isAuthenticated: false;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false
});

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ user: null, isAuthenticated: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};