import { initializeApp } from "firebase/app";
import { browserLocalPersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

let persistence: any = browserLocalPersistence;

// Check if we're in React Native environment
try {
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  const { getReactNativePersistence } = require("firebase/auth");
  if (typeof getReactNativePersistence === "function") {
    persistence = getReactNativePersistence(AsyncStorage);
  }
} catch (e) {
  // If React Native modules are not available, use browser persistence
  persistence = browserLocalPersistence;
}

const firebaseConfig = {
  apiKey: "AIzaSyA05yhUhsht3Eg8azc4T06_dlivxlMGd3E",
  authDomain: "habitmate-8872b.firebaseapp.com",
  projectId: "habitmate-8872b",
  storageBucket: "habitmate-8872b.firebasestorage.app",
  messagingSenderId: "92805708128",
  appId: "1:92805708128:web:c3212c476605444c268605",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//for authentication
export const auth = initializeAuth(app, {
  persistence: persistence,
});
export const db = getFirestore(app);
