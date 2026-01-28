import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    query,
    updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "habits";

export interface Habit {
  id?: string;
  name: string;
  description: string;
  category: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  icon: string;
  color: string;
  completed: boolean;
  createdAt: string;
}

/**
 * Save a new habit to Firestore
 */
export const saveHabitToFirestore = async (
  habit: Habit,
): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), habit);
    console.log("Habit saved to Firestore with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving habit to Firestore:", error);
    throw error;
  }
};

/**
 * Get all habits from Firestore
 */
export const getAllHabitsFromFirestore = async (): Promise<Habit[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const snapshot = await getDocs(q);
    const habits = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Habit,
    );
    return habits;
  } catch (error) {
    console.error("Error fetching habits from Firestore:", error);
    throw error;
  }
};

/**
 * Listen to real-time updates from Firestore
 */
export const subscribeToHabits = (
  callback: (habits: Habit[]) => void,
  errorCallback?: (error: any) => void,
): (() => void) => {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const habits = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Habit,
        );
        callback(habits);
      },
      (error) => {
        console.error("Error listening to Firestore habits:", error);
        if (errorCallback) {
          errorCallback(error);
        }
      },
    );
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up Firestore listener:", error);
    throw error;
  }
};

/**
 * Update a habit in Firestore
 */
export const updateHabitInFirestore = async (
  habitId: string,
  updates: Partial<Habit>,
): Promise<void> => {
  try {
    const habitDoc = doc(db, COLLECTION_NAME, habitId);
    await updateDoc(habitDoc, updates);
    console.log("Habit updated in Firestore:", habitId);
  } catch (error) {
    console.error("Error updating habit in Firestore:", error);
    throw error;
  }
};

/**
 * Delete a habit from Firestore
 */
export const deleteHabitFromFirestore = async (
  habitId: string,
): Promise<void> => {
  try {
    const habitDoc = doc(db, COLLECTION_NAME, habitId);
    await deleteDoc(habitDoc);
    console.log("Habit deleted from Firestore:", habitId);
  } catch (error) {
    console.error("Error deleting habit from Firestore:", error);
    throw error;
  }
};

/**
 * Sync a habit from local to Firestore (for offline-first approach)
 */
export const syncHabitToFirestore = async (habit: Habit): Promise<void> => {
  try {
    if (habit.id) {
      // Update existing habit
      await updateHabitInFirestore(habit.id, habit);
    } else {
      // Create new habit
      await saveHabitToFirestore(habit);
    }
  } catch (error) {
    console.error("Error syncing habit to Firestore:", error);
    throw error;
  }
};
