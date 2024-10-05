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
import { User, DJ, Feedback, Bookings, Booking } from "./types";

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
    console.log("createUser - Line 1 - Attempting to create user with email:", email);
    
    if (!auth) {
      console.log("createUser - Line 6");
      throw new Error("Authentication instance is undefined.");
    }

    const usernameExists = await isUsernameTaken(newUser.username!, usersRef);
    console.log("createUser - Line 10 - Checked if username exists:", newUser.username);

    if (usernameExists) {
      console.log("createUser - Line 14 - Username Exists");
      throw new Error("Username is already taken.");
    }

    const defaultProfilePicture =
      "https://firebasestorage.googleapis.com/v0/b/find-my-dj-3a559.appspot.com/o/DJ-1.jpg?alt=media&token=b112f41e-5c50-44b7-b0ce-45240bef1cec";
    if (!newUser.profile_picture) {
      newUser.profile_picture = defaultProfilePicture;
      console.log("createUser - Line 22 - Default profile picture set.");
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("createUser - Line 29 - User created:", user.uid);

    await setDoc(doc(usersRef, user.uid), newUser);
    console.log("createUser - Line 33 - User data saved.");

    const userDocRef = doc(usersRef, user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    console.log("createUser - Line 37 - Retrieved user document:", userDocSnapshot.data());

    return userDocSnapshot.data();
  } catch (error) {
    console.log("createUser - Line 42 - Error occurred");
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
    console.log("createDJ - Line 1 - Attempting to create DJ with email:", email);

    if (!auth) {
      console.log("createDJ - Line 6");
      throw new Error("Authentication instance is undefined.");
    }

    const usernameExists = await isUsernameTaken(newDJ.username!, djRef);
    console.log("createDJ - Line 10 - Checked if username exists:", newDJ.username);

    if (usernameExists) {
      console.log("createDJ - Line 14 - Username Exists");
      throw new Error("Username is already taken.");
    }

    const defaultProfilePicture =
      "https://firebasestorage.googleapis.com/v0/b/find-my-dj-3a559.appspot.com/o/DJ-1.jpg?alt=media&token=b112f41e-5c50-44b7-b0ce-45240bef1cec";
    if (!newDJ.profile_picture) {
      newDJ.profile_picture = defaultProfilePicture;
      console.log("createDJ - Line 22 - Default profile picture set.");
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("createDJ - Line 29 - DJ created:", user.uid);

    await setDoc(doc(djRef, user.uid), newDJ);
    console.log("createDJ - Line 33 - DJ data saved.");

    const djDocRef = doc(djRef, user.uid);
    const djDocSnapshot = await getDoc(djDocRef);
    console.log("createDJ - Line 37 - Retrieved DJ document:", djDocSnapshot.data());

    return djDocSnapshot.data();
  } catch (error) {
    console.log("createDJ - Line 42 - Error occurred");
    console.error("Error: ", error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    console.log("deleteUser - Line 1 - Attempting to delete user with ID:", userId);
    
    if (!auth) {
      console.log("deleteUser - Line 6");
      throw new Error("Authentication instance is undefined.");
    }
    const user = auth.currentUser;
    if (!user || user.uid !== userId) {
      console.log("deleteUser - Line 10 - No valid authenticated user found for deletion.");
      throw new Error("No valid authenticated user found for deletion.");
    }

    const userDocRef = doc(usersRef, userId);
    console.log("deleteUser - Line 16 - Deleting user document:", userId);
    await deleteDoc(userDocRef);
    console.log("deleteUser - Line 19 - User document deleted from Firestore.");

    await firebaseDeleteUser(user);
    console.log("deleteUser - Line 22 - User deleted from Firebase Authentication.");
  } catch (error) {
    console.log("deleteUser - Line 25 - Error occurred");
    console.error("Error deleting user: ", error);
    throw error;
  }
}

export async function deleteDJ(userId: string) {
  try {
    console.log("deleteDJ - Line 1 - Attempting to delete DJ with ID:", userId);
    
    if (!auth) {
      console.log("deleteDJ - Line 6");
      throw new Error("Authentication instance is undefined.");
    }
    const user = auth.currentUser;
    if (!user || user.uid !== userId) {
      console.log("deleteDJ - Line 10 - No valid authenticated DJ found for deletion.");
      throw new Error("No valid authenticated DJ found for deletion.");
    }

    const djDocRef = doc(djRef, userId);
    console.log("deleteDJ - Line 16 - Deleting DJ document:", userId);
    await deleteDoc(djDocRef);
    console.log("deleteDJ - Line 19 - DJ document deleted from Firestore.");

    await firebaseDeleteUser(user);
    console.log("deleteDJ - Line 22 - DJ deleted from Firebase Authentication.");
  } catch (error) {
    console.log("deleteDJ - Line 25 - Error occurred");
    console.error("Error deleting DJ: ", error);
    throw error;
  }
}

export function signIn(email: string, password: string) {
  console.log("signIn - Line 1 - Attempting to sign in with email:", email);
  
  if (!auth) {
    console.log("signIn - Line 6 - Authentication instance is undefined.");
    throw new Error("Authentication instance is undefined.");
  }
  
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("signIn - Line 12 - Signed in user:", user);
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("signIn - Line 17 - Error occurred:", errorCode, errorMessage);
      throw new Error(error);
    });
}

export async function signOut() {
  try {
    console.log("signOut - Line 1 - Attempting to sign out.");
    if (!auth) {
      console.log("signOut - Line 5 - Authentication instance is undefined.");
      throw new Error("Authentication instance is undefined.");
    }
    await firebaseSignOut(auth);
    console.log("signOut - Line 9 - User signed out successfully.");
  } catch (error) {
    console.log("signOut - Line 12 - Error occurred");
    console.error("Error signing out: ", error);
    throw error;
  }
}

export async function getAllDjs(): Promise<DJ[]> {
  console.log("getAllDjs - Line 1 - Fetching all DJs.");
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
  console.log("getAllDjs - Line 12 - Retrieved DJs:", djsArray);
  return djsArray;
}

export async function getUserById(userId: string): Promise<User | null> {
  console.log("getUserById - Line 1 - Fetching User by ID:", userId);

  try {
    const userDocRef = doc(usersRef, userId); 

    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      console.log("getUserById - Line 6 - User found:", userDocSnapshot.data());
      return userDocSnapshot.data() as User
    } else {
      console.log("getUserById - Line 11 - No user found for ID:", userId);
      return null;
    }
  } catch (error) {
    console.error("getUserById - Error fetching user by ID:", error);
    throw error; 
  }
}

export async function getDJById(id: string): Promise<DJ | null> {
  console.log("getDJById - Line 1 - Fetching DJ by ID:", id);
  const djDocRef = doc(djRef, id);
  const djDocSnapshot = await getDoc(djDocRef);

  if (djDocSnapshot.exists()) {
    console.log("getDJById - Line 6 - DJ found:", djDocSnapshot.data());
    return {
      id: djDocSnapshot.id,
      ...djDocSnapshot.data(),
    } as DJ;
  } else {
    console.log("getDJById - Line 11 - No DJ found for ID:", id);
    return null;
  }
}

export async function getFeedback(djUsername: string): Promise<Feedback[]> {
  console.log("getFeedback - Line 1 - Fetching feedback for DJ:", djUsername);

  const feedbackArray: Feedback[] = [];

  const feedbackRef = collection(db, 'feedback');
  const feedbackQuery = query(feedbackRef, where('dj', '==', djUsername));

  try {
    const feedbackSnapshot: QuerySnapshot<DocumentData> = await getDocs(feedbackQuery);

    feedbackSnapshot.forEach((doc) => {
      const feedbackData = doc.data() as Omit<Feedback, 'id'>;
      feedbackArray.push({
        id: doc.id,
        ...feedbackData,
      });
    });

    console.log("getFeedback - Line 12 - Retrieved feedback:", feedbackArray);
  } catch (error) {
    console.error("getFeedback - Error fetching feedback:", error);
    throw error; 
  }

  return feedbackArray;
}

export async function getBookingsByDj(djUsername: string): Promise<Booking[]> {
  console.log("getBookingsByDj - Line 1 - Fetching bookings for DJ:", djUsername);

  const bookingsArray: Booking[] = [];

  const bookingsRef = collection(db, 'bookings'); 
  const bookingsQuery = query(bookingsRef, where('dj', '==', djUsername));

  try {
    const bookingsSnapshot: QuerySnapshot<DocumentData> = await getDocs(bookingsQuery);

    bookingsSnapshot.forEach((doc) => {
      const bookingData = doc.data() as Omit<Booking, 'id'>;
      bookingsArray.push(...bookingData, id)
    });
    console.log("getBookingsByDj - Line 12 - Retrieved bookings:", bookingsArray);
    }

  catch (error) {
    console.error("getBookingsByDj - Error fetching bookings:", error);
    throw error; 
  }

  return bookingsArray;
}

export async function getBookingByUser(userUsername: string): Promise<Booking[]> {
  console.log("getBookingByUser - Line 1 - Fetching bookings for User:", userUsername);

  const bookingsArray: Booking[] = [];

  const bookingsRef = collection(db, 'bookings'); 
  const bookingsQuery = query(bookingsRef, where('client', '==', userUsername));

  try {
    const bookingsSnapshot: QuerySnapshot<DocumentData> = await getDocs(bookingsQuery);

    
    bookingsSnapshot.forEach((doc) => {
      const bookingData = doc.data() as Omit<Booking, 'date'>;
      bookingsArray.push({
        date: doc.date, 
        ...bookingData,
      });
    });

    console.log("getBookingByUser - Line 12 - Retrieved bookings:", bookingsArray);
  } catch (error) {
    console.error("getBookingByUser - Error fetching bookings:", error);
    throw error; 
  }

  return bookingsArray;
}

export async function createBooking(booking: Booking): Promise<void> {
  try {
    console.log("createBooking - Line 1 - Attempting to create booking:", booking);
    await addDoc(bookingsRef, booking);
    console.log("createBooking - Line 4 - Booking created successfully.");
  } catch (error) {
    console.log("createBooking - Line 7 - Error occurred");
    console.error("Error creating booking: ", error);
    throw error;
  }
}

export async function updateBooking(bookingId: string, updatedData: Partial<Booking>): Promise<void> {
  try {
    console.log("updateBooking - Line 1 - Attempting to update booking ID:", bookingId);

    const bookingDocRef = doc(bookingsRef, bookingId);

    await updateDoc(bookingDocRef, updatedData);

    console.log("updateBooking - Line 5 - Booking updated successfully.");
  } catch (error) {
    console.log("updateBooking - Line 8 - Error occurred");
    console.error("Error updating booking: ", error);
    throw error;
  }
}

export async function deleteBooking(bookingId: string): Promise<void> {
  try {
    console.log("deleteBooking - Line 1 - Attempting to delete booking ID:", bookingId);
    const bookingDocRef = doc(bookingsRef, bookingId);
    await deleteDoc(bookingDocRef);
    console.log("deleteBooking - Line 5 - Booking deleted successfully.");
  } catch (error) {
    console.log("deleteBooking - Line 8 - Error occurred");
    console.error("Error deleting booking: ", error);
    throw error;
  }
}

export async function patchUser(userId: string, newDetails: Partial<User>): Promise<void> {
  try {
    console.log("patchUser - Line 1 - Attempting to update user ID:", userId);

    const userDocRef = doc(usersRef, userId);

    await updateDoc(userDocRef, newDetails);

    console.log("patchUser - Line 5 - User updated successfully.");
  } catch (error) {
    console.log("patchUser - Line 8 - Error occurred");
    console.error("Error updating user: ", error);
    throw error;
  }
}

export async function patchDJ(djId: string, newDetails: Partial<DJ>): Promise<void> {
  try {
    console.log("patchDJ - Line 1 - Attempting to update DJ ID:", djId);

    const djDocRef = doc(djRef, djId);

    await updateDoc(djDocRef, newDetails);

    console.log("patchDJ - Line 5 - DJ updated successfully.");
  } catch (error) {
    console.log("patchDJ - Line 8 - Error occurred");
    console.error("Error updating DJ: ", error);
    throw error; 
  }
}