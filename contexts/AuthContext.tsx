import React, { createContext, useState, ReactNode, useEffect } from "react";
import { firebase, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userId: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(
        "User State Changed:",
        user?.uid,
        "Authenticated?",
        isAuthenticated
      ); // debugging
      if (user) {
        setIsAuthenticated(true);
        setUserId(user.uid);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId }}>
      {children}
    </AuthContext.Provider>
  );
};
