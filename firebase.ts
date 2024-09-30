import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  doc,
  setDoc,
  getDoc,
  query,
  getDocs,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
} from "firebase/auth";
import firebase from "firebase/compat/app";
export {firebase}

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
const auth = getAuth(app);

onAuthStateChanged(auth, (user: FirebaseUser | null) => {
  if (user) {

    console.log("Current logged-in user: ", user.uid);
  } else {

    console.log("No user is currently logged in.");
  }
});


interface User {
  username: string;
  first_name: string;
  surname: string;
  city: string;
}

interface DJ extends User {
  genre: string;
  Occasions: string;
  Price: number;  
  Description: string;
}

export function createUser(email: string, password:string , newUser: {email?: string, password?: string, city?: string, username?: string}) {
  
  return createUserWithEmailAndPassword(auth, email, password)
     .then(async (userCredential) => {
 
       const user = userCredential.user;
       console.log(user.email)
       console.log("Signed up: ", user.uid);
 
       const usersRef = collection(db, "users");
       await setDoc(doc(usersRef, user.uid), newUser);
       
       const userDocRef = doc(usersRef, user.uid);
       const userDocSnapshot = await getDoc(userDocRef);
       return userDocSnapshot.data()
     })
     .catch((error) => {
       const errorCode = error.code;
       const errorMessage = error.message;
       console.error("Error: ", errorCode, errorMessage);
     });
 }
 

export function createDJ(email: string, password:string , newDJ: {email?: string, password?: string, city?: string, username?: string, genre?: string, occasions?: string, price?: number, description?: string}) {
  
  return createUserWithEmailAndPassword(auth, email, password)
     .then(async (userCredential) => {
 
       const user = userCredential.user;
       console.log(user.email)
       console.log("Signed up: ", user.uid);
 
       const djRef = collection(db, "djs");
       await setDoc(doc(djRef, user.uid), newDJ);
       
       const djDocRef = doc(djRef, user.uid);
       const djDocSnapshot = await getDoc(djDocRef);
       return djDocSnapshot.data()
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
      console.log("Signed in: ", user.uid);
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
return djsArray
}

//   const q1 = query(collection(db, "users"));
//   const usersArray: User[] = [];
//   const querySnapshot1: QuerySnapshot<DocumentData> = await getDocs(q1);
//   querySnapshot1.forEach((doc) => {
//     usersArray.push(doc.data() as User);
//   });

// main().catch((err) => console.error(err));