import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const signup = async (email: string, password: string, role: string) => {
  try {
    console.log("Attempting to sign up user with email:", email, "and role:", role);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed up successfully. UID:", user.uid);
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: role,
    });
    console.log("User role and email saved to Firestore for UID:", user.uid);
    return user;
  } catch (error: any) {
    console.error("Signup error for email:", email, error.message);
    throw new Error(error.message);
  }
};

export const login = async (email: string, password: string) => {
  try {
    console.log("Attempting to log in user with email:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User logged in successfully. UID:", user.uid);
    return user;
  } catch (error: any) {
    console.error("Login error for email:", email, error.message);
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    console.log("Attempting to log out user.");
    await signOut(auth);
    console.log("User logged out successfully.");
  } catch (error: any) {
    console.error("Logout error:", error.message);
    throw new Error(error.message);
  }
};

export const getUserRole = async (uid: string) => {
  try {
    console.log("Attempting to get role for UID:", uid);
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const role = docSnap.data()?.role;
      console.log("Role found for UID:", uid, "-", role);
      return role;
    } else {
      console.log("No user document found for UID:", uid);
      return null;
    }
  } catch (error: any) {
    console.error("Error getting user role for UID:", uid, error.message);
    throw new Error(error.message);
  }
};
