import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

interface UserData {
  name: string;
  age: number;
  role: string;
}

const registerUser = async (email: string, password: string, userData: UserData): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), userData);
    console.log("User registered and data saved!");
  } catch (error) {
    console.error("Error creating user:", error);
  }
};
