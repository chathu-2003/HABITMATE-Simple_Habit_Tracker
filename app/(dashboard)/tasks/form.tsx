import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ThankYouScreen = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/(dashboard)/home");
  };
  return (
    <View className="flex-1 justify-center items-center bg-slate-950 px-6">
      {/* Success Icon */}
      <View className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-emerald-500">
        <Ionicons name="checkmark" size={48} color="#10b981" />
      </View>

      <Text className="text-3xl font-bold text-white mb-2">Thank You!</Text>

      <Text className="text-lg text-slate-400 text-center mb-10">
        Your form has been successfully submitted.
      </Text>

      <TouchableOpacity
        className="bg-emerald-500 py-4 px-10 rounded-2xl w-full items-center"
        onPress={handleBackToHome}
        style={{
          shadowColor: "#10b981",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Ionicons name="arrow-back" size={20} color="white" />
        <Text className="text-white font-semibold text-lg ml-2">
          Back to Home
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ThankYouScreen;
