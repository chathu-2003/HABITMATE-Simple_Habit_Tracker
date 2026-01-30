import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
    getAllHabits,
    toggleHabitCompletion,
} from "../../services/habitService";

export default function Home() {
  const router = useRouter();
  const [habits, setHabits] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load habits when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadHabits();
    }, []),
  );

  const loadHabits = async () => {
    const storedHabits = await getAllHabits();
    setHabits(storedHabits);
  };

  const toggleHabit = async (id: string) => {
    const success = await toggleHabitCompletion(id);
    if (success) {
      // Reload habits after toggle
      loadHabits();
    }
  };

  // Calculate progress
  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => h.completed).length;
  const progressPercentage =
    totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

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
        <View className="mb-8">
          <Text className="text-slate-400 text-sm font-medium">
            {new Date().toDateString()}
          </Text>
          <Text className="text-4xl font-bold text-white mt-2 tracking-tight">
            Hello, Chathura 👋
          </Text>
          <Text className="text-slate-400 mt-2 text-base">
            Let&apos;s build good habits today
          </Text>
        </View>

        {/* Progress Card */}
        <View
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 mb-8"
          style={{
            elevation: 8,
            shadowColor: "#10b981",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            backgroundColor: "#10b981",
          }}
        >
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-emerald-100 text-sm font-semibold tracking-wide">
                TODAY&apos;S PROGRESS
              </Text>
              <Text className="text-white text-4xl font-bold mt-3">
                {completedHabits} / {totalHabits}
              </Text>
              <Text className="text-emerald-100 text-base mt-1">
                Habits Completed
              </Text>
            </View>
            <View className="bg-white/20 rounded-2xl p-3">
              <Ionicons name="flame" size={32} color="white" />
            </View>
          </View>

          {/* Progress Bar */}
          <View className="bg-emerald-700/30 h-2 rounded-full mt-4 overflow-hidden">
            <View
              className="bg-white h-full rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>

          <Text className="text-emerald-100 mt-3 text-sm font-medium">
            {progressPercentage === 100
              ? "Amazing! All habits completed! 🎉"
              : progressPercentage >= 50
                ? "Keep going! You're doing great 🔥"
                : totalHabits === 0
                  ? "Start by adding your first habit! 💪"
                  : "Let&apos;s make progress today! 💪"}
          </Text>
        </View>

        {/* Quick Navigation */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-white mb-5 tracking-tight">
            Quick Access
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {/* Add Habit */}
            <TouchableOpacity
              onPress={() => router.push("/add-habit")}
              className="bg-slate-900 w-[48%] rounded-2xl p-5 mb-4 border-2 border-slate-800"
              style={{
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
              }}
            >
              <View className="bg-emerald-500/10 w-12 h-12 rounded-xl items-center justify-center mb-3">
                <Ionicons name="add-circle-outline" size={26} color="#10b981" />
              </View>
              <Text className="font-bold text-white text-base">Add Habit</Text>
              <Text className="text-slate-400 text-sm mt-1">
                Create new habit
              </Text>
            </TouchableOpacity>

            {/* Progress */}
            <TouchableOpacity
              onPress={() => router.push("/progress")}
              className="bg-slate-900 w-[48%] rounded-2xl p-5 mb-4 border-2 border-slate-800"
              style={{
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
              }}
            >
              <View className="bg-blue-500/10 w-12 h-12 rounded-xl items-center justify-center mb-3">
                <Ionicons name="bar-chart-outline" size={26} color="#3b82f6" />
              </View>
              <Text className="font-bold text-white text-base">Progress</Text>
              <Text className="text-slate-400 text-sm mt-1">
                View analytics
              </Text>
            </TouchableOpacity>

            {/* Tasks */}
            <TouchableOpacity
              onPress={() => router.push("/tasks")}
              className="bg-slate-900 w-[48%] rounded-2xl p-5 mb-4 border-2 border-slate-800"
              style={{
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
              }}
            >
              <View className="bg-purple-500/10 w-12 h-12 rounded-xl items-center justify-center mb-3">
                <Ionicons
                  name="checkmark-done-outline"
                  size={26}
                  color="#a855f7"
                />
              </View>
              <Text className="font-bold text-white text-base">Tasks</Text>
              <Text className="text-slate-400 text-sm mt-1">
                Manage daily tasks
              </Text>
            </TouchableOpacity>

            {/* Profile */}
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              className="bg-slate-900 w-[48%] rounded-2xl p-5 mb-4 border-2 border-slate-800"
              style={{
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
              }}
            >
              <View className="bg-amber-500/10 w-12 h-12 rounded-xl items-center justify-center mb-3">
                <Ionicons name="person-outline" size={26} color="#f59e0b" />
              </View>
              <Text className="font-bold text-white text-base">Profile</Text>
              <Text className="text-slate-400 text-sm mt-1">
                Account details
              </Text>
            </TouchableOpacity>


          </View>
        </View>

        {/* Today&apos;s Habits */}
        <View>
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-2xl font-bold text-white tracking-tight">
              Today&apos;s Habits
            </Text>
            <Text className="text-slate-400 text-sm">
              {totalHabits} {totalHabits === 1 ? "habit" : "habits"}
            </Text>
          </View>

          {/* Empty State */}
          {habits.length === 0 ? (
            <View className="bg-slate-900 rounded-2xl p-8 border-2 border-slate-800 items-center">
              <View className="bg-slate-800 w-20 h-20 rounded-full items-center justify-center mb-4">
                <Ionicons name="clipboard-outline" size={40} color="#64748b" />
              </View>
              <Text className="text-slate-300 text-xl font-bold mb-2">
                No habits yet
              </Text>
              <Text className="text-slate-400 text-sm text-center mb-6">
                Start building better habits by{"\n"}adding your first one!
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/add-habit")}
                className="bg-emerald-500 px-6 py-3 rounded-xl flex-row items-center"
                style={{
                  shadowColor: "#10b981",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <Ionicons name="add-circle-outline" size={20} color="white" />
                <Text className="text-white font-bold ml-2">
                  Add Your First Habit
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Habit Cards */
            habits.map((habit) => (
              <TouchableOpacity
                key={habit.id}
                onPress={() => toggleHabit(habit.id)}
                activeOpacity={0.7}
                className={`bg-slate-900 rounded-2xl p-5 mb-4 flex-row items-center border-2 ${
                  habit.completed ? "border-emerald-500/20" : "border-slate-800"
                }`}
                style={{
                  elevation: 4,
                  shadowColor: habit.completed ? "#10b981" : "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}
              >
                <View
                  className={`w-12 h-12 rounded-xl items-center justify-center mr-4`}
                  style={{
                    backgroundColor: habit.completed
                      ? "#10b981"
                      : `${habit.color}20`,
                  }}
                >
                  <Ionicons
                    name={habit.completed ? "checkmark" : habit.icon}
                    size={24}
                    color={habit.completed ? "white" : habit.color}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-lg">
                    {habit.name}
                  </Text>
                  <Text
                    className={`text-sm font-medium mt-1 ${
                      habit.completed ? "text-emerald-400" : "text-slate-400"
                    }`}
                  >
                    {habit.completed ? "Completed ✓" : "Pending"}
                  </Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${
                    habit.completed ? "bg-emerald-500/10" : "bg-slate-800"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      habit.completed ? "text-emerald-400" : "text-slate-400"
                    }`}
                  >
                    {habit.completed ? "DONE" : "TODO"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => router.push("/add-habit")}
        activeOpacity={0.85}
        className="absolute bottom-8 right-6 bg-emerald-500 w-16 h-16 rounded-full items-center justify-center"
        style={{
          elevation: 12,
          shadowColor: "#10b981",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
        }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
