import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
    getAllHabitsFromFirestore,
    subscribeToHabits,
} from "../services/firestoreService";
import { getAllHabits } from "../services/habitService";

export default function Progress() {
  const router = useRouter();
  const [habits, setHabits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load habits from Firestore with real-time listener
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let mounted = true;

    const setupListener = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Setting up Firestore listener...");

        unsubscribe = subscribeToHabits(
          (firestoreHabits) => {
            if (mounted) {
              console.log("Firestore habits received:", firestoreHabits.length);
              setHabits(firestoreHabits);
              setIsLoading(false);
            }
          },
          (error) => {
            if (mounted) {
              console.error("Firestore error:", error);
              setError("Failed to load from Firestore, using local data");
              // Fallback to local storage
              const loadLocal = async () => {
                try {
                  const localHabits = await getAllHabits();
                  if (mounted) {
                    console.log(
                      "Loaded from local storage:",
                      localHabits.length,
                    );
                    setHabits(localHabits);
                    setIsLoading(false);
                  }
                } catch (localError) {
                  if (mounted) {
                    console.error("Error loading local habits:", localError);
                    setError("Failed to load habits");
                    setIsLoading(false);
                  }
                }
              };
              loadLocal();
            }
          },
        );
      } catch (error) {
        if (mounted) {
          console.error("Setup listener error:", error);
          setError("Connection error");
          setIsLoading(false);
        }
      }
    };

    setupListener();

    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Also load from local storage on focus as backup
  useFocusEffect(
    React.useCallback(() => {
      const refreshHabits = async () => {
        try {
          // Try to get fresh data from Firestore first
          const firestoreHabits = await getAllHabitsFromFirestore();
          console.log(
            "Refreshed from Firestore on focus:",
            firestoreHabits.length,
          );
          setHabits(firestoreHabits);
          setError(null);
          setIsLoading(false);
        } catch (firestoreErr) {
          console.warn(
            "Focus: Firestore refresh failed, trying local:",
            firestoreErr,
          );
          // Fallback to local storage
          try {
            const localHabits = await getAllHabits();
            console.log("Refreshed from local on focus:", localHabits.length);
            setHabits(localHabits);
            if (localHabits.length === 0) {
              setError("No habits found");
            } else {
              setError(null);
            }
            setIsLoading(false);
          } catch (localErr) {
            console.error("Focus: Local refresh failed:", localErr);
            setError("Failed to refresh habits");
            setIsLoading(false);
          }
        }
      };
      refreshHabits();
    }, []),
  );

  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => h.completed).length;
  const progressPercentage =
    totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  // Group habits by category
  const habitsByCategory = habits.reduce(
    (acc, habit) => {
      if (!acc[habit.category]) {
        acc[habit.category] = [];
      }
      acc[habit.category].push(habit);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  // Calculate category progress
  const categoryProgress = Object.entries(
    habitsByCategory as Record<string, any[]>,
  ).map(([category, categoryHabits]) => {
    const arr = categoryHabits as any[];
    const total = arr.length;
    const completed = arr.filter((h) => h.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      name: category,
      completed,
      total,
      percentage,
    };
  });

  return (
    <View className="flex-1 bg-slate-950">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 120,
        }}
      >
        {/* Header */}
        <View className="mb-8 flex-row items-center justify-between">
          <View>
            <Text className="text-4xl font-bold text-white tracking-tight">
              Progress
            </Text>
            <Text className="text-slate-400 text-base mt-2">
              Track your habit journey
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-slate-900 w-12 h-12 rounded-xl items-center justify-center border border-slate-800"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-red-900/20 border border-red-500 rounded-2xl p-4 mb-6">
            <Text className="text-red-300 font-semibold">{error}</Text>
          </View>
        )}

        {/* Loading State */}
        {isLoading && habits.length === 0 && (
          <View
            className="bg-slate-900 rounded-3xl p-8 mb-8 border-2 border-slate-800 items-center justify-center"
            style={{ minHeight: 200 }}
          >
            <Ionicons name="hourglass-outline" size={48} color="#64748b" />
            <Text className="text-slate-300 text-xl font-bold mt-4">
              Loading Progress...
            </Text>
            <Text className="text-slate-400 text-center mt-2">
              Connecting to database
            </Text>
          </View>
        )}

        {/* Overall Progress Card */}
        {!isLoading && totalHabits > 0 ? (
          <View
            className="bg-gradient-to-br rounded-3xl p-8 mb-8"
            style={{
              backgroundColor: "#10b981",
              elevation: 8,
              shadowColor: "#10b981",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
            }}
          >
            <View className="flex-row justify-between items-start mb-6">
              <View>
                <Text className="text-emerald-100 text-sm font-semibold tracking-wide">
                  OVERALL PROGRESS
                </Text>
                <Text className="text-white text-5xl font-bold mt-3">
                  {progressPercentage}%
                </Text>
                <Text className="text-emerald-100 text-base mt-2">
                  {completedHabits} of {totalHabits} habits completed
                </Text>
              </View>
              <View className="bg-white/20 rounded-2xl p-4">
                <Ionicons name="trophy" size={40} color="white" />
              </View>
            </View>

            {/* Progress Bar */}
            <View className="bg-emerald-700/30 h-3 rounded-full overflow-hidden">
              <View
                className="bg-white h-full rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </View>

            <Text className="text-emerald-100 mt-4 text-sm font-medium">
              {progressPercentage === 100
                ? "Amazing! You've completed all your habits today! 🎉"
                : progressPercentage >= 75
                  ? "Almost there! Keep up the great work! 🔥"
                  : progressPercentage >= 50
                    ? "You're on the right track! Keep going! 💪"
                    : progressPercentage > 0
                      ? "Good start! Keep building momentum! 🚀"
                      : "Start completing habits to build your streak! 💪"}
            </Text>
          </View>
        ) : !isLoading ? (
          <View
            className="bg-slate-900 rounded-3xl p-8 mb-8 border-2 border-slate-800 items-center justify-center"
            style={{ minHeight: 200 }}
          >
            <Ionicons name="bar-chart-outline" size={48} color="#64748b" />
            <Text className="text-slate-300 text-xl font-bold mt-4">
              No Progress Yet
            </Text>
            <Text className="text-slate-400 text-center mt-2">
              Add habits to start tracking your progress
            </Text>
          </View>
        ) : null}

        {/* Category Progress */}
        {categoryProgress.length > 0 && !isLoading && (
          <View>
            <Text className="text-2xl font-bold text-white mb-5 tracking-tight">
              Progress by Category
            </Text>

            {categoryProgress.map((cat, index) => (
              <View
                key={index}
                className="bg-slate-900 rounded-2xl p-5 mb-4 border-2 border-slate-800"
              >
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-white font-bold text-base">
                    {cat.name}
                  </Text>
                  <View className="bg-emerald-500/10 px-3 py-1 rounded-full">
                    <Text className="text-emerald-400 text-xs font-bold">
                      {cat.percentage}%
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View className="bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                  <View
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </View>

                <Text className="text-slate-400 text-xs">
                  {cat.completed} of {cat.total} completed
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Statistics */}
        {totalHabits > 0 && !isLoading && (
          <View>
            <Text className="text-2xl font-bold text-white mb-5 tracking-tight">
              Statistics
            </Text>

            <View className="flex-row justify-between gap-3 mb-4">
              {/* Completed Card */}
              <View className="flex-1 bg-slate-900 rounded-2xl p-5 border-2 border-emerald-500/20 items-center">
                <Ionicons name="checkmark-circle" size={32} color="#10b981" />
                <Text className="text-white font-bold text-2xl mt-3">
                  {completedHabits}
                </Text>
                <Text className="text-slate-400 text-xs mt-1">Completed</Text>
              </View>

              {/* Remaining Card */}
              <View className="flex-1 bg-slate-900 rounded-2xl p-5 border-2 border-amber-500/20 items-center">
                <Ionicons name="time-outline" size={32} color="#f59e0b" />
                <Text className="text-white font-bold text-2xl mt-3">
                  {totalHabits - completedHabits}
                </Text>
                <Text className="text-slate-400 text-xs mt-1">Remaining</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
