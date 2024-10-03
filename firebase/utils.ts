import { query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig"

export async function isUsernameTaken(
  username: string,
  ref: any
): Promise<boolean> {
  const q = query(ref, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}


export async function isDjAccount(djId: string): Promise<boolean> {
  let isDj = true;
  try {
    const docRef = doc(db, "djs", djId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      isDj = true;
    } else {
      isDj = false;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    isDj = false;
  }
  return isDj;
}
