import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const loging = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  await signOut(auth);
  AsyncStorage.clear();

  return;
};
export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  console.log("🔵 Starting registration for:", name, email);

  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  console.log("✅ User created with UID:", userCred.user.uid);

  // Update Firebase Auth profile
  await updateProfile(userCred.user, {
    displayName: name,
    photoURL: "",
  });
  console.log("✅ Auth profile updated with displayName:", name);

  // Save user data to Firestore
  await setDoc(doc(db, "users", userCred.user.uid), {
    name,
    displayName: name,
    role: "",
    email,
    createdAt: new Date(),
  });
  console.log("✅ Firestore document created with name:", name);
  console.log("✅ Firestore document created with displayName:", name);
  console.log("🎉 Registration complete!");

  // Reload user to ensure displayName is synced
  await userCred.user.reload();
  console.log("🔄 User profile reloaded");

  return userCred.user;
};

