import React, { createContext, useState, ReactNode, useEffect } from "react";
import { firebase, auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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
  console.log("fetchUsername - Line 25")

  if (userGrab.exists()) {
    console.log("fetchUsername - Line 28")
    return userGrab.data()?.username || null;
  }

  const djDoc = doc(db, "djs", uid);
  const djGrab = await getDoc(djDoc);
  console.log("fetchUsername - Line 34")
  if (djGrab.exists()) {
    console.log("fetchUsername - Line 36")
    return djGrab.data()?.username || null;
  }
  console.log("fetchUsername - Line 39")
  console.log("Document does not exist for UID", uid);
  return null;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    console.log("AuthContext useEffect - Line 50")
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("AuthContext useEffect - Line 52")
      if (user) {
        setIsAuthenticated(true);
        setUserId(user.uid);
        const fetchedUsername = await fetchUsername(user.uid);
        setUsername(fetchedUsername);
        console.log("AuthContext useEffect - Line 58")
      } else {
        setIsAuthenticated(false);
        setUserId(null);
        setUsername(null);
        console.log("AuthContext useEffect - Line 63")
      }
    });
    console.log("AuthContext useEffect - Line 66")
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, username }}>
      {children}
    </AuthContext.Provider>
  );
};

