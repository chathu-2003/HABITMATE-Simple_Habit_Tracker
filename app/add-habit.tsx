import React from "react";
import { View, Text } from "react-native";

export default function AddHabit() {
  return (
    <View className="flex-1 items-center justify-center bg-[#F4F6FB] px-5">
      <Text className="text-2xl font-bold text-gray-800">Add Habit</Text>
      <Text className="text-gray-500 mt-2">Create a new habit here.</Text>
    </View>
  );
}
