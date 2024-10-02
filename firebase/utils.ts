import { query, where, getDocs } from "firebase/firestore";

export async function isUsernameTaken(
  username: string,
  ref: any
): Promise<boolean> {
  const q = query(ref, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}
