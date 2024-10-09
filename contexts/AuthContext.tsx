import React, { createContext, useState, ReactNode, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userId: null,
  username: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

const fetchUsername = async (uid: string): Promise<string | null> => {
  const userDoc = doc(db, "users", uid);
  const userGrab = await getDoc(userDoc);

  if (userGrab.exists()) {

    return userGrab.data()?.username || null;
  }

  const djDoc = doc(db, "djs", uid);
  const djGrab = await getDoc(djDoc);

  if (djGrab.exists()) {

    return djGrab.data()?.username || null;
  }
  return null;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
  
      if (user) {
        setIsAuthenticated(true);
        setUserId(user.uid);
        const fetchedUsername = await fetchUsername(user.uid);
        setUsername(fetchedUsername);

      } else {
        setIsAuthenticated(false);
        setUserId(null);
        setUsername(null);

      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, username }}>
      {children}
    </AuthContext.Provider>
  );
};

