import { query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig"

export async function isUsernameTaken(
  username: string,
  ref: any
): Promise<boolean> {
  console.log("isUsernameTaken - Line 8")
  const q = query(ref, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  console.log("isUsernameTaken - Line 11")
  return !querySnapshot.empty;
}

export async function isDjAccount(djId: string) {
  let isDj = true;
  try {
    const docRef = doc(db, "djs", djId);
    const docSnap = await getDoc(docRef);
    console.log("isDjAccount - Line 20")

    if (docSnap.exists()) {
      console.log("isDjAccount - Line 23")
      isDj = true;
    } else {
      console.log("isDjAccount - Line 26")
      isDj = false;
    }
  } catch (error) {
    console.log("isDjAccount - Line 30")
    console.error("Error getting document:", error);
    isDj = false;
  }
  console.log("isDjAccount - Line 34")
  return isDj;
}
