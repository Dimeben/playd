import { getStorage } from "firebase/storage";
import { app } from "./firebaseConfig";

const storage = getStorage(app);

export { storage };
