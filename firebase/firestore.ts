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
    
    if (!auth) {
      throw new Error("Authentication instance is undefined.");
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

    await firebaseDeleteUser(user);
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

    await firebaseDeleteUser(user);
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
    if (!auth) {
      throw new Error("Authentication instance is undefined.");
    }
    await firebaseSignOut(auth);
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

export async function getUserById(userId: string): Promise<User | null> {

  try {
    const userDocRef = doc(usersRef, userId); 

    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data() as User
    } else {
      return null;
    }
  } catch (error) {
    console.error("getUserById - Error fetching user by ID:", error);
    throw error; 
  }
}

export async function getDJById(id: string): Promise<DJ | null> {
  const djDocRef = doc(djRef, id);
  const djDocSnapshot = await getDoc(djDocRef);

  if (djDocSnapshot.exists()) {
    return djDocSnapshot.data() as DJ
  } else {
    return null;
  }
}

export async function getFeedback(djUsername: string): Promise<Feedback[]> {

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

  } catch (error) {
    throw error; 
  }

  return feedbackArray;
}

export async function postFeedback(feedback: Feedback): Promise<void> {
  try {

    if (
      !feedback.author || 
      !feedback.body || 
      !feedback.dj || 
      !feedback.stars || 
      !feedback.title || 
      feedback.stars < 1 || 
      feedback.stars > 5
    ) {
      throw new Error("Missing or invalid required fields in feedback object.");
    }

    const feedbackData = {
      author: feedback.author,
      body: feedback.body,
      dj: feedback.dj,
      stars: feedback.stars,
      title: feedback.title,
      date: Timestamp.fromDate(feedback.date),
    };
    await addDoc(feedbackRef, feedbackData);

  } catch (error) {
    throw error;
  }
}



export const getBookingsByUser = async (username: string): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("client", "==", username));
    const querySnapshot = await getDocs(q);

    const bookings: Booking[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        id: doc.id,
        client: data.client || "",         
        dj: data.dj || "",
        comments: data.comments || "",
        event_details: data.event_details || "",
        date: data.date?.toDate() || new Date(), 
        time: data.time || "",
        location: data.location || "",
        occasion: data.occasion || "",
        status: data.status || "pending",
        feedback_left: data.feedback_left || false
      });
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching user bookings: ", error);
    throw error;
  }
};

export const getBookingsByDj = async (djUsername: string): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("dj", "==", djUsername));
    const querySnapshot = await getDocs(q);

    const bookings: Booking[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        id: doc.id,
        client: data.client || "",
        dj: data.dj || "",
        comments: data.comments || "",
        event_details: data.event_details || "",
        date: data.date?.toDate() || new Date(),
        time: data.time || "",
        location: data.location || "",
        occasion: data.occasion || "",
        status: data.status || "pending",
        feedback_left: data.feedback_left || false
      });
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching DJ bookings: ", error);
    throw error;
  }
};

export const acceptBooking = async (bookingId: string): Promise<void> => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, { status: "accepted" });
  } catch (error) {
    console.error("Error accepting booking:", error);
  }
};

export const denyBooking = async (bookingId: string): Promise<void> => { 
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, { status: "declined" });
  } catch (error) {
    console.error("Error denying booking:", error);
  }
};

export async function createBooking(booking: Partial<Booking>): Promise<void> {
  try {
    await addDoc(bookingsRef, { ...booking, status: 'pending' }); 
  } catch (error) {
    console.error("Error creating booking: ", error);
    throw error;
  }
}

export async function updateBooking(bookingId: string, updatedData: Partial<Booking>): Promise<void> {

  try {
  
    const bookingDocRef = doc(bookingsRef, bookingId);

    await updateDoc(bookingDocRef, updatedData);
    
  } catch (error) {
    console.error("Error updating booking: ", error);
  console.error("Error details: ", (error as Error).message);
    throw error;
  }
}

export async function deleteBooking(bookingId: string): Promise<void> {
  try {
    
    const bookingDocRef = doc(bookingsRef, bookingId);
    await deleteDoc(bookingDocRef);
  } catch (error) {

    console.error("Error deleting booking: ", error);
    throw error;
  }
}

export async function patchUser(userId: string, newDetails: Partial<User>): Promise<void> {
  try {


    const userDocRef = doc(usersRef, userId);

    await updateDoc(userDocRef, newDetails);

  } catch (error) {
    console.error("Error updating user: ", error);
    throw error;
  }
}

export async function patchDJ(djId: string, newDetails: Partial<DJ>): Promise<void> {
  try {

    const djDocRef = doc(djRef, djId);

    await updateDoc(djDocRef, newDetails);

  } catch (error) {
    console.error("Error updating DJ: ", error);
    throw error; 
  }
}

export async function patchDJByUsername(username: string, newDetails: Partial<DJ>): Promise<void> {
  try {

    const djQuery = query(djRef, where("username", "==", username));
    
    const querySnapshot = await getDocs(djQuery);
    if (!querySnapshot.empty) {
      const djDoc = querySnapshot.docs[0];
      const djId = djDoc.id;


      await patchDJ(djId, newDetails);
    } else {
      console.error("patchDJByUsername - No DJ found with the specified username.");
      throw new Error("No DJ found with the specified username.");
    }
  } catch (error) {
    console.error("Error updating DJ by username: ", error);
    throw error; 
  }
}
