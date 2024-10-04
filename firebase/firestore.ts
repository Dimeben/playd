import {
  collection,
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
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  deleteUser as firebaseDeleteUser,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { app, db, auth } from "./firebaseConfig";
import { isUsernameTaken } from "./utils";
import { DJ, Feedback, Bookings, Booking } from "./types";

export const usersRef = collection(db, "users");
export const djRef = collection(db, "djs");
export const feedbackRef = collection(db, "feedback");
export const bookingsRef = collection(db, "bookings");

export async function createUser(
  email: string,
  password: string,
  newUser: {
    first_name?: string;
    surname?: string;
    city?: string;
    username?: string;
    profile_picture?: string | null | undefined;
  }
) {
  try {
    if (!auth) {
      throw new Error("Authentication instance is undefined.");
    }
    const usernameExists = await isUsernameTaken(newUser.username!, usersRef);
    if (usernameExists) {
      console.log(usernameExists, "Username Exists");
      throw new Error("Username is already taken.");
    }

    const defaultProfilePicture =
      "https://firebasestorage.googleapis.com/v0/b/find-my-dj-3a559.appspot.com/o/DJ-1.jpg?alt=media&token=b112f41e-5c50-44b7-b0ce-45240bef1cec";
    if (!newUser.profile_picture) {
      newUser.profile_picture = defaultProfilePicture;
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("Signed up: ", user.uid);

    await setDoc(doc(usersRef, user.uid), newUser);
    const userDocRef = doc(usersRef, user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    return userDocSnapshot.data();
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
}

export async function createDJ(
  email: string,
  password: string,
  newDJ: {
    first_name?: string;
    surname?: string;
    city?: string;
    username?: string;
    genres?: string[];
    occasions?: string[];
    price?: number;
    description?: string;
    profile_picture?: string | null | undefined;
    rating: number;
  }
) {
  try {
    if (!auth) {
      throw new Error("Authentication instance is undefined.");
    }
    const usernameExists = await isUsernameTaken(newDJ.username!, djRef);
    if (usernameExists) {
      throw new Error("Username is already taken.");
    }

    const defaultProfilePicture =
      "https://firebasestorage.googleapis.com/v0/b/find-my-dj-3a559.appspot.com/o/DJ-1.jpg?alt=media&token=b112f41e-5c50-44b7-b0ce-45240bef1cec";
    if (!newDJ.profile_picture) {
      newDJ.profile_picture = defaultProfilePicture;
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("Signed up: ", user.uid);

    await setDoc(doc(djRef, user.uid), newDJ);
    const djDocRef = doc(djRef, user.uid);
    const djDocSnapshot = await getDoc(djDocRef);
    return djDocSnapshot.data();
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    if (!auth) {
      throw new Error("Authentication instance is undefined.");
    }
    const user = auth.currentUser;
    if (!user || user.uid !== userId) {
      throw new Error("No valid authenticated user found for deletion.");
    }

    const userDocRef = doc(usersRef, userId);
    await deleteDoc(userDocRef);
    console.log(`User document with ID ${userId} deleted from Firestore`);

    await firebaseDeleteUser(user);
    console.log(`User with ID ${userId} deleted from Firebase Authentication`);
  } catch (error) {
    console.error("Error deleting user: ", error);
    throw error;
  }
}

export async function deleteDJ(userId: string) {
  try {
    if (!auth) {
      throw new Error("Authentication instance is undefined.");
    }
    const user = auth.currentUser;
    if (!user || user.uid !== userId) {
      throw new Error("No valid authenticated DJ found for deletion.");
    }

    const djDocRef = doc(djRef, userId);
    await deleteDoc(djDocRef);
    console.log(`DJ document with ID ${userId} deleted from Firestore`);

    await firebaseDeleteUser(user);
    console.log(`DJ with ID ${userId} deleted from Firebase Authentication`);
  } catch (error) {
    console.error("Error deleting DJ: ", error);
    throw error;
  }
}

export function signIn(email: string, password: string) {
  if (!auth) {
    throw new Error("Authentication instance is undefined.");
  }
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Signed in: ", user);
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error: ", errorCode, errorMessage);
      throw new Error(error);
    });
}

export async function signOut() {
  try {
    if (!auth) {
      throw new Error("Authentication instance is undefined.");
    }
    await firebaseSignOut(auth);
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
}

export async function getAllDjs(): Promise<DJ[]> {
  const allDjs = query(collection(db, "djs"));
  const djsArray: DJ[] = [];
  const getAllDjsSnapshot: QuerySnapshot<DocumentData> = await getDocs(allDjs);

  getAllDjsSnapshot.forEach((doc) => {
    const djData = doc.data() as Omit<DJ, "id">;
    djsArray.push({
      id: doc.id,
      ...djData,
    });
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

export const getBookingByDj = async (djId: string): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, "bookings");
    const djQuery = query(bookingsRef, where("djId", "==", djId));
    const djQuerySnapshot = await getDocs(djQuery);

    const fetchedBookings = djQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];

    console.log("Fetched bookings for DJ:", fetchedBookings);
    return fetchedBookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};



export const getBookingByUser = async (userId: string): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, "bookings");
    const userQuery = query(bookingsRef, where("userId", "==", userId));
    const userQuerySnapshot = await getDocs(userQuery);

    const fetchedBookings = userQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];

    console.log("Fetched bookings for user:", fetchedBookings);
    return fetchedBookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

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
  djId: string;
  userId: string;
  location: string;
  occasion: string;
}) {
  try {
    const bookingWithTimestamp = {
      ...newBooking,
      date: Timestamp.fromDate(newBooking.date),
      status: "pending",
    };
    await addDoc(bookingsRef, bookingWithTimestamp);
    console.log("Booking created successfully!");
  } catch (error) {
    console.error("Error: Booking failed!", error);
  }
}

export const updateBookingStatus = async (bookingId: string, newStatus: string) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, { status: newStatus });
    console.log(`Booking ${bookingId} updated to ${newStatus}`);
  } catch (error) {
    console.error("Error updating booking status: ", error);
  }
};

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