import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  query,
  getDocs,
  DocumentData,
  QuerySnapshot,
  where,
  updateDoc,
} from "firebase/firestore";

import {
  getAuth,
  getReactNativePersistence,
  inMemoryPersistence,
  initializeAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  Auth,
} from "firebase/auth";
import firebase from "firebase/compat/app";
export { firebase };
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDmik3S723nZR-fFM70ilaoAObfPCBKpGc",
  authDomain: "find-my-dj-3a559.firebaseapp.com",
  projectId: "find-my-dj-3a559",
  storageBucket: "find-my-dj-3a559.appspot.com",
  messagingSenderId: "230071268783",
  appId: "1:230071268783:web:01c20d2e1f29178f566b5a",
  measurementId: "G-TXBJCGPGC6",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export let auth: Auth | undefined;

const isReactNative = () => {
  return Platform.OS === "ios" || Platform.OS === "android";
};

if (isReactNative()) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  auth = initializeAuth(app, {
    persistence: inMemoryPersistence,
  });
}

// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });
export const storage = getStorage(app);

const usersRef = collection(db, "users");
const djRef = collection(db, "djs");
const feedbackRef = collection(db, "feedback");
const bookingsRef = collection(db, "bookings");

onAuthStateChanged(auth, (user: FirebaseUser | null) => {
  if (user) {
    // console.log("Current logged-in user: ", user.uid);
  } else {
    // console.log("No user is currently logged in.");
  }
});

interface User {
  username: string;
  first_name: string;
  surname: string;
  city: string;
  profile_picture?: string | null;
}

interface DJ extends User {
  genres: string[];
  occasions: string[];
  price: number;
  description: string;
}

interface Feedback {
  author: string;
  body: string;
  booking_id: string;
  date: Date;
  dj: string;
  stars: number;
  title: string;
}

interface Bookings {
  client: string;
  comments: string;
  event_details: string;
  date: Date;
  dj: string;
  location: string;
  occasion: string;
}

export function createUser(
  email: string,
  password: string,
  newUser: {
    email?: string;
    password?: string;
    first_name?: string;
    surname?: string;
    city?: string;
    username?: string;
    profile_picture?: string | null | undefined;
  }
) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log(user.email);
      console.log("Signed up: ", user.uid);

      await setDoc(doc(usersRef, user.uid), newUser);

      const userDocRef = doc(usersRef, user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      return userDocSnapshot.data();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error: ", errorCode, errorMessage);
    });
}

export function createDJ(
  email: string,
  password: string,
  newDJ: {
    email?: string;
    password?: string;
    first_name?: string;
    surname?: string;
    city?: string;
    username?: string;
    genres?: string[];
    occasions?: string[];
    price?: number;
    description?: string;
    profile_picture?: string | null | undefined;
  }
) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log(user.email);
      console.log("Signed up: ", user.uid);

      await setDoc(doc(djRef, user.uid), newDJ);

      const djDocRef = doc(djRef, user.uid);
      const djDocSnapshot = await getDoc(djDocRef);
      return djDocSnapshot.data();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error: ", errorCode, errorMessage);
    });
}

export function signIn(email: string, password: string) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Signed in: ", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error: ", errorCode, errorMessage);
    });
}

export async function getAllDjs() {
  const allDjs = query(collection(db, "djs"));
  const djsArray: DJ[] = [];
  const getAllDjsSnapshot: QuerySnapshot<DocumentData> = await getDocs(allDjs);
  getAllDjsSnapshot.forEach((doc) => {
    djsArray.push(doc.data() as DJ);
  });
  return djsArray;
}

export async function getFeedbackByDj(loggedInDj: string) {
  const feedbackQuery = query(feedbackRef, where("dj", "==", loggedInDj));
  const feedbackArray: Feedback[] = [];
  const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
    feedbackQuery
  );
  querySnapshot.forEach((doc) => {
    feedbackArray.push(doc.data() as Feedback);
  });
  return feedbackArray;
}

export async function getBookingByDj(loggedInDj: string) {
  const bookingsQuery = query(bookingsRef, where("dj", "==", loggedInDj));
  const bookingArray: Bookings[] = [];
  const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
    bookingsQuery
  );
  querySnapshot.forEach((doc) => {
    bookingArray.push(doc.data() as Bookings);
  });
  return bookingArray;
}

export async function getBookingByUser(loggedInUser: string) {
  const bookingsQuery = query(bookingsRef, where("client", "==", loggedInUser));
  const bookingArray: Bookings[] = [];
  const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
    bookingsQuery
  );
  querySnapshot.forEach((doc) => {
    bookingArray.push(doc.data() as Bookings);
  });
  return bookingArray;
}

export async function getUserById(userId: string) {
  const singleUserRef = doc(db, "users", userId);
  const docSnap = await getDoc(singleUserRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
}

export async function getDjById(djId: string) {
  const singleDjRef = doc(db, "djs", djId);
  const docSnap = await getDoc(singleDjRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
}

export async function createBooking(newBooking: {
  client: string;
  comments: string;
  event_details: string;
  date: Date;
  dj: string;
  location: string;
  occasion: string;
}) {
  try {
    await addDoc(bookingsRef, newBooking);
  } catch (error) {
    console.error("Error: Booking failed!");
  }
}

export async function createFeedback(newFeedback: {
  author: string;
  body: string;
  booking_id: string;
  date: Date;
  dj: string;
  stars: number;
  title: string;
}) {
  try {
    await addDoc(feedbackRef, newFeedback);
  } catch (error) {
    console.error("Error: Feedback failed!");
  }
}

export async function patchDj(
  djId: string,
  patchedDJ: {
    city?: string;
    username?: string;
    genres?: string[];
    occasions?: string[];
    price?: number;
    description?: string;
    profile_picture?: string | null | undefined;
  }
) {
  const updateDjRef = doc(db, "djs", djId);
  await updateDoc(updateDjRef, patchedDJ)
    .then(async () => {
      const updateSnap = await getDoc(updateDjRef);
      return updateSnap.data();
    })
    .catch((err) => {
      console.log(err);
    });
}

export async function patchUser(
  userId: string,
  patchedUser: {
    first_name?: string;
    surname?: string;
    city?: string;
    username?: string;
    profile_picture?: string | null | undefined;
  }
) {
  const updateUserRef = doc(db, "users", userId);
  await updateDoc(updateUserRef, patchedUser)
    .then(async () => {
      const updateSnap = await getDoc(updateUserRef);
      return updateSnap.data();
    })
    .catch((err) => {
      console.log(err);
    });
}

// main().catch((err) => console.error(err));
