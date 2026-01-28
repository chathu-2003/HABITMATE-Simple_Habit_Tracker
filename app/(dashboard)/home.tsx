import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F4F6FB] px-5 pt-12">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-gray-500 text-sm">
          {new Date().toDateString()}
        </Text>
        <Text className="text-3xl font-extrabold text-gray-800 mt-1">
          Hello, Chathura 👋
        </Text>
        <Text className="text-gray-500 mt-1">
          Let’s build good habits today
        </Text>
      </View>

      {/* Progress Card */}
      <View
        className="bg-[#4F46E5] rounded-3xl p-6 mb-6"
        style={{ elevation: 5 }}
      >
        <Text className="text-white text-lg font-semibold">
          Today’s Progress
        </Text>
        <Text className="text-white text-3xl font-extrabold mt-2">
          3 / 5 Habits
        </Text>
        <Text className="text-indigo-200 mt-1">
          Keep going! You’re doing great 🔥
        </Text>
      </View>

      {/* Today Habits */}
      <Text className="text-xl font-bold text-gray-800 mb-4">
        Today’s Habits
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Habit Card - Completed */}
        <View
          className="bg-white rounded-2xl p-4 mb-4 flex-row items-center justify-between"
          style={{ elevation: 3 }}
        >
          <View className="flex-row items-center">
            <View className="bg-green-100 p-2 rounded-full mr-4">
              <Ionicons name="checkmark" size={20} color="#22C55E" />
            </View>
            <View>
              <Text className="text-gray-800 font-semibold text-lg">
                Drink Water
              </Text>
              <Text className="text-gray-500 text-sm">
                Completed ✔
              </Text>
            </View>
          </View>
        </View>

        {/* Habit Card - Pending */}
        <View
          className="bg-white rounded-2xl p-4 mb-4 flex-row items-center justify-between"
          style={{ elevation: 3 }}
        >
          <View className="flex-row items-center">
            <View className="bg-yellow-100 p-2 rounded-full mr-4">
              <Ionicons name="time-outline" size={20} color="#F59E0B" />
            </View>
            <View>
              <Text className="text-gray-800 font-semibold text-lg">
                Morning Exercise
              </Text>
              <Text className="text-gray-500 text-sm">
                Pending
              </Text>
            </View>
          </View>
        </View>

        {/* Habit Card */}
        <View
          className="bg-white rounded-2xl p-4 mb-20 flex-row items-center justify-between"
          style={{ elevation: 3 }}
        >
          <View className="flex-row items-center">
            <View className="bg-blue-100 p-2 rounded-full mr-4">
              <Ionicons name="book-outline" size={20} color="#3B82F6" />
            </View>
            <View>
              <Text className="text-gray-800 font-semibold text-lg">
                Read 20 Minutes
              </Text>
              <Text className="text-gray-500 text-sm">
                Pending
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => router.push("/add-habit")}
        activeOpacity={0.85}
        className="absolute bottom-8 right-6 bg-[#4F46E5] w-16 h-16 rounded-full items-center justify-center"
        style={{ elevation: 6 }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
