import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  getAllHabits,
  toggleHabitCompletion,
} from "../../services/habitService";

export default function Home() {
  const router = useRouter();
  const [habits, setHabits] = useState<any[]>([]);

  // Load habits when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  const loadHabits = async () => {
    const storedHabits = await getAllHabits();
    setHabits(storedHabits);
  };

  const toggleHabit = async (id: string) => {
    await toggleHabitCompletion(id);
    loadHabits();
  };

  // Progress calculation
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
          <Text className="text-4xl font-bold text-white mt-2">
            Hello, Chathura 👋
          </Text>
          <Text className="text-slate-400 mt-2">
            Let&apos;s build good habits today
          </Text>
        </View>

        {/* Progress Card */}
        <View
          className="rounded-3xl p-6 mb-8"
          style={{
            backgroundColor: "#10b981",
            elevation: 8,
          }}
        >
          <Text className="text-emerald-100 text-sm font-semibold">
            TODAY&apos;S PROGRESS
          </Text>
          <Text className="text-white text-4xl font-bold mt-3">
            {completedHabits} / {totalHabits}
          </Text>
          <Text className="text-emerald-100 mt-1">
            Habits Completed
          </Text>

          <View className="bg-emerald-700/30 h-2 rounded-full mt-4">
            <View
              className="bg-white h-full rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
        </View>

        {/* Quick Access */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-white mb-5">
            Quick Access
          </Text>

          <View className="flex-row flex-wrap justify-between">
            <QuickButton
              title="Add Habit"
              icon="add-circle-outline"
              color="#10b981"
              onPress={() => router.push("/add-habit")}
            />
            <QuickButton
              title="Progress"
              icon="bar-chart-outline"
              color="#3b82f6"
              onPress={() => router.push("/progress")}
            />
            <QuickButton
              title="Habits"
              icon="list-outline"
              color="#a855f7"
              onPress={() => router.push("/habits")}
            />
            <QuickButton
              title="Profile"
              icon="person-outline"
              color="#f59e0b"
              onPress={() => router.push("/profile")}
            />
          </View>
        </View>

        {/* Today’s Habits */}
        <View>
          <Text className="text-2xl font-bold text-white mb-4">
            Today&apos;s Habits
          </Text>

          {habits.length === 0 ? (
            <Text className="text-slate-400">No habits yet</Text>
          ) : (
            habits.map((habit) => (
              <TouchableOpacity
                key={habit.id}
                onPress={() => router.push("/habits")} // ✅ CORRECT
                onLongPress={() => toggleHabit(habit.id)}
                className="bg-slate-900 rounded-2xl p-5 mb-4 flex-row items-center border border-slate-800"
              >
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
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
                  <Text className="text-slate-400 text-sm">
                    {habit.completed ? "Completed" : "Pending"}
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
        className="absolute bottom-8 right-6 bg-emerald-500 w-16 h-16 rounded-full items-center justify-center"
        style={{ elevation: 12 }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

/* ===== Helper Component ===== */
function QuickButton({
  title,
  icon,
  color,
  onPress,
}: {
  title: string;
  icon: any;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-slate-900 w-[48%] rounded-2xl p-5 mb-4 border border-slate-800"
    >
      <View
        className="w-12 h-12 rounded-xl items-center justify-center mb-3"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <Text className="text-white font-bold">{title}</Text>
    </TouchableOpacity>
  );
}
