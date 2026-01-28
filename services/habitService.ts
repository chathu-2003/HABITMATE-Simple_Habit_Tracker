import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  icon: string;
  color: string;
  completed: boolean;
  createdAt: string;
}

const HABITS_STORAGE_KEY = "habits_list";

/**
 * Add a new habit to storage
 */
export const addHabit = async (habit: Habit): Promise<boolean> => {
  try {
    const existingHabits = await getAllHabits();
    const updatedHabits = [...existingHabits, habit];
    await AsyncStorage.setItem(
      HABITS_STORAGE_KEY,
      JSON.stringify(updatedHabits),
    );
    return true;
  } catch (error) {
    console.error("Error adding habit:", error);
    return false;
  }
};

/**
 * Get all habits from storage
 */
export const getAllHabits = async (): Promise<Habit[]> => {
  try {
    const habitsJson = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
    if (habitsJson) {
      return JSON.parse(habitsJson) as Habit[];
    }
    return [];
  } catch (error) {
    console.error("Error getting habits:", error);
    return [];
  }
};

/**
 * Get a specific habit by ID
 */
export const getHabitById = async (habitId: string): Promise<Habit | null> => {
  try {
    const habits = await getAllHabits();
    return habits.find((h) => h.id === habitId) || null;
  } catch (error) {
    console.error("Error getting habit by ID:", error);
    return null;
  }
};

/**
 * Update a habit
 */
export const updateHabit = async (
  habitId: string,
  updates: Partial<Habit>,
): Promise<boolean> => {
  try {
    const habits = await getAllHabits();
    const updatedHabits = habits.map((h) =>
      h.id === habitId ? { ...h, ...updates } : h,
    );
    await AsyncStorage.setItem(
      HABITS_STORAGE_KEY,
      JSON.stringify(updatedHabits),
    );
    return true;
  } catch (error) {
    console.error("Error updating habit:", error);
    return false;
  }
};

/**
 * Delete a habit
 */
export const deleteHabit = async (habitId: string): Promise<boolean> => {
  try {
    const habits = await getAllHabits();
    const filteredHabits = habits.filter((h) => h.id !== habitId);
    await AsyncStorage.setItem(
      HABITS_STORAGE_KEY,
      JSON.stringify(filteredHabits),
    );
    return true;
  } catch (error) {
    console.error("Error deleting habit:", error);
    return false;
  }
};

/**
 * Toggle habit completion status
 */
export const toggleHabitCompletion = async (
  habitId: string,
): Promise<boolean> => {
  try {
    const habit = await getHabitById(habitId);
    if (habit) {
      return await updateHabit(habitId, { completed: !habit.completed });
    }
    return false;
  } catch (error) {
    console.error("Error toggling habit completion:", error);
    return false;
  }
};

/**
 * Clear all habits
 */
export const clearAllHabits = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(HABITS_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing all habits:", error);
    return false;
  }
};

/**
 * Get habits by category
 */
export const getHabitsByCategory = async (
  category: string,
): Promise<Habit[]> => {
  try {
    const habits = await getAllHabits();
    return habits.filter((h) => h.category === category);
  } catch (error) {
    console.error("Error getting habits by category:", error);
    return [];
  }
};

/**
 * Get completed habits count
 */
export const getCompletedHabitsCount = async (): Promise<number> => {
  try {
    const habits = await getAllHabits();
    return habits.filter((h) => h.completed).length;
  } catch (error) {
    console.error("Error getting completed habits count:", error);
    return 0;
  }
};
