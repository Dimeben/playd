import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  getReactNativePersistence,
  inMemoryPersistence,
  initializeAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { firebaseConfig } from "../firebase-authkey.js";
import firebase from "firebase/compat/app";

export { firebase };
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export let auth = (() => {
  if (Platform.OS === "ios" || Platform.OS === "android") {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    return initializeAuth(app, {
      persistence: inMemoryPersistence,
    });
  }
})();
