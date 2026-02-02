import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";

/* =======================
   Habit Interface
======================= */
export interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  icon: string;
  color: string;
  completed: boolean;
  createdAt: Timestamp;
  userId: string;
}

const HABITS_COLLECTION = "habits";

/* =======================
   ADD HABIT
======================= */
export const addHabit = async (
  habit: Omit<Habit, "id" | "createdAt" | "userId">,
): Promise<boolean> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("❌ No user logged in");
      return false;
    }

    await addDoc(collection(db, HABITS_COLLECTION), {
      ...habit,
      completed: habit.completed ?? false,
      createdAt: serverTimestamp(),
      userId,
    });
    console.log("✅ Habit added successfully for user:", userId);
    return true;
  } catch (error) {
    console.error("❌ addHabit error:", error);
    return false;
  }
};

/* =======================
   GET ALL HABITS
======================= */
export const getAllHabits = async (): Promise<Habit[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("❌ No user logged in");
      return [];
    }

    console.log("🔍 Fetching habits for userId:", userId);

    const q = query(
      collection(db, HABITS_COLLECTION),
      where("userId", "==", userId),
    );
    const snapshot = await getDocs(q);
    const habits = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Habit, "id">),
    }));

    console.log(`✅ Loaded ${habits.length} habits for user: ${userId}`);

    // Log each habit's userId for debugging
    habits.forEach((h) => {
      console.log(`  - Habit: ${h.name}, userId: ${h.userId}`);
    });

    return habits;
  } catch (error) {
    console.error("❌ getAllHabits error:", error);
    return [];
  }
};

/* =======================
   GET HABIT BY ID
======================= */
export const getHabitById = async (habitId: string): Promise<Habit | null> => {
  try {
    const snap = await getDoc(doc(db, HABITS_COLLECTION, habitId));
    if (!snap.exists()) {
      console.warn(`⚠️ Habit not found: ${habitId}`);
      return null;
    }

    return {
      id: snap.id,
      ...(snap.data() as Omit<Habit, "id">),
    };
  } catch (error) {
    console.error("❌ getHabitById error:", error);
    return null;
  }
};

/* =======================
   UPDATE HABIT ✅
======================= */
export const updateHabit = async (
  habitId: string,
  updates: Partial<Omit<Habit, "id" | "createdAt">>,
): Promise<boolean> => {
  try {
    // Check if document exists before updating
    const habitDoc = await getDoc(doc(db, HABITS_COLLECTION, habitId));

    if (!habitDoc.exists()) {
      console.error(`❌ Cannot update: Habit ${habitId} does not exist`);
      return false;
    }

    await updateDoc(doc(db, HABITS_COLLECTION, habitId), updates);
    console.log(`✅ Habit ${habitId} updated successfully`);
    return true;
  } catch (error) {
    console.error("❌ updateHabit error:", error);
    return false;
  }
};

/* =======================
   DELETE HABIT
======================= */
export const deleteHabit = async (habitId: string): Promise<boolean> => {
  try {
    // Check if document exists before deleting
    const habitDoc = await getDoc(doc(db, HABITS_COLLECTION, habitId));

    if (!habitDoc.exists()) {
      console.error(`❌ Cannot delete: Habit ${habitId} does not exist`);
      return false;
    }

    await deleteDoc(doc(db, HABITS_COLLECTION, habitId));
    console.log(`✅ Habit ${habitId} deleted successfully`);
    return true;
  } catch (error) {
    console.error("❌ deleteHabit error:", error);
    return false;
  }
};

/* =======================
   TOGGLE COMPLETION ✅
======================= */
export const toggleHabitCompletion = async (
  habitId: string,
): Promise<boolean> => {
  try {
    const habit = await getHabitById(habitId);

    if (!habit) {
      console.error(`❌ Cannot toggle: Habit ${habitId} does not exist`);
      return false;
    }

    await updateDoc(doc(db, HABITS_COLLECTION, habitId), {
      completed: !habit.completed,
    });

    console.log(
      `✅ Habit ${habitId} completion toggled to ${!habit.completed}`,
    );
    return true;
  } catch (error) {
    console.error("❌ toggleHabitCompletion error:", error);
    return false;
  }
};