import {createUserWithEmailAndPassword, signOut, updateProfile} from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, setDoc } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const loging = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password)
}

export const logout = async () => {
    await signOut(auth)
    AsyncStorage.clear()

    return
}
export const registerUser = async(
    name:string,
    email:string,
    password:string
) => {
   const userCred = await createUserWithEmailAndPassword(auth, email, password)
   updateProfile(userCred.user,{
    displayName: name,
    photoURL:""
   })
   
   //role
   //firestore (db)
   setDoc(doc(db, "users",userCred.user.uid), {
    name,
    role: "",
    email,
    createdAt: new Date()

   })
   return userCred.user
}