import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { addHabit } from "../../services/habitService";

export default function AddHabit() {
  const router = useRouter();

  // States
  const [habitName, setHabitName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFrequency, setSelectedFrequency] =
    useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [focusedField, setFocusedField] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Categories and Frequencies
  const categories = [
    { name: "Health", icon: "fitness", color: "#10b981" },
    { name: "Work", icon: "briefcase", color: "#3b82f6" },
    { name: "Learning", icon: "book", color: "#8b5cf6" },
    { name: "Social", icon: "people", color: "#f59e0b" },
    { name: "Personal", icon: "person", color: "#ec4899" },
    { name: "Other", icon: "apps", color: "#6366f1" },
  ];

  const frequencies = ["Daily", "Weekly", "Monthly"] as const;

  // Create Habit
  const handleCreateHabit = async () => {
    if (!habitName.trim()) {
      setTimeout(() => Alert.alert("Required Field", "Please enter a habit name"), 100);
      return;
    }

    if (!selectedCategory) {
      setTimeout(() => Alert.alert("Required Field", "Please select a category"), 100);
      return;
    }

    setIsLoading(true);

    try {
      const category = categories.find((c) => c.name === selectedCategory);

      const newHabit = {
        name: habitName.trim(),
        description: description.trim(),
        category: selectedCategory,
        frequency: selectedFrequency,
        icon: category?.icon || "apps",
        color: category?.color || "#6366f1",
        completed: false,
      };

      const success = await addHabit(newHabit);

      if (!success) {
        setTimeout(() => Alert.alert("Error", "Failed to save habit. Please try again."), 100);
        setIsLoading(false);
        return;
      }

      // Show success alert
      setTimeout(() => {
        Alert.alert(
          "Success! 🎉",
          `"${habitName}" has been added to your habits!`,
          [
            {
              text: "Add Another",
              onPress: () => {
                setHabitName("");
                setDescription("");
                setSelectedCategory("");
                setSelectedFrequency("Daily");
                setIsLoading(false);
              },
            },
            {
              text: "Done",
              onPress: () => {
                setIsLoading(false);
                router.back();
              },
              style: "cancel",
            },
          ]
        );
      }, 100);
    } catch (error) {
      console.error("Error creating habit:", error);
      setTimeout(() => Alert.alert("Error", "An unexpected error occurred."), 100);
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-6 pt-16 pb-6 border-b border-slate-800">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              disabled={isLoading}
              className="bg-slate-900 w-10 h-10 rounded-xl items-center justify-center border border-slate-800"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-white tracking-tight">
              Create Habit
            </Text>
            <View className="w-10" />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Habit Name */}
          <View className="mb-6">
            <Text className="text-slate-300 mb-3 font-semibold text-base">
              Habit Name *
            </Text>
            <View
              className={`bg-slate-900 rounded-2xl border-2 ${
                focusedField === "name" ? "border-emerald-500" : "border-slate-800"
              }`}
              style={{
                shadowColor: focusedField === "name" ? "#10b981" : "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: focusedField === "name" ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: focusedField === "name" ? 8 : 2,
              }}
            >
              <TextInput
                placeholder="e.g., Drink 8 glasses of water"
                placeholderTextColor="#64748b"
                value={habitName}
                onChangeText={setHabitName}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField("")}
                editable={!isLoading}
                className="px-5 py-4 text-white text-base"
              />
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-slate-300 mb-3 font-semibold text-base">
              Description (Optional)
            </Text>
            <View
              className={`bg-slate-900 rounded-2xl border-2 ${
                focusedField === "description" ? "border-emerald-500" : "border-slate-800"
              }`}
              style={{
                shadowColor: focusedField === "description" ? "#10b981" : "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: focusedField === "description" ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: focusedField === "description" ? 8 : 2,
              }}
            >
              <TextInput
                placeholder="Why is this habit important to you?"
                placeholderTextColor="#64748b"
                value={description}
                onChangeText={setDescription}
                onFocus={() => setFocusedField("description")}
                onBlur={() => setFocusedField("")}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!isLoading}
                className="px-5 py-4 text-white text-base"
              />
            </View>
          </View>

          {/* Category */}
          <View className="mb-6">
            <Text className="text-slate-300 mb-3 font-semibold text-base">Category *</Text>
            <View className="flex-row flex-wrap gap-3">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => setSelectedCategory(category.name)}
                  disabled={isLoading}
                  className={`flex-row items-center px-4 py-3 rounded-xl border-2 ${
                    selectedCategory === category.name
                      ? "bg-emerald-500/10 border-emerald-500"
                      : "bg-slate-900 border-slate-800"
                  }`}
                  style={{
                    elevation: selectedCategory === category.name ? 4 : 2,
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={18}
                    color={selectedCategory === category.name ? "#10b981" : category.color}
                  />
                  <Text
                    className={`ml-2 font-semibold ${
                      selectedCategory === category.name ? "text-emerald-400" : "text-slate-300"
                    }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Frequency */}
          <View className="mb-8">
            <Text className="text-slate-300 mb-3 font-semibold text-base">Frequency</Text>
            <View className="flex-row gap-3">
              {frequencies.map((frequency) => (
                <TouchableOpacity
                  key={frequency}
                  onPress={() => setSelectedFrequency(frequency)}
                  disabled={isLoading}
                  className={`flex-1 py-4 rounded-xl border-2 ${
                    selectedFrequency === frequency
                      ? "bg-emerald-500 border-emerald-500"
                      : "bg-slate-900 border-slate-800"
                  }`}
                  style={{
                    elevation: selectedFrequency === frequency ? 6 : 2,
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  <Text
                    className={`text-center font-bold ${
                      selectedFrequency === frequency ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {frequency}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview Card */}
          {habitName && selectedCategory && (
            <View className="mb-6">
              <Text className="text-slate-300 mb-3 font-semibold text-base">Preview</Text>
              <View className="bg-slate-900 rounded-2xl p-5 flex-row items-center border-2 border-slate-800">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{
                    backgroundColor: `${categories.find((c) => c.name === selectedCategory)?.color}20`,
                  }}
                >
                  <Ionicons
                    name={(categories.find((c) => c.name === selectedCategory)?.icon || "apps") as any}
                    size={24}
                    color={categories.find((c) => c.name === selectedCategory)?.color || "#6366f1"}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-lg">{habitName}</Text>
                  <Text className="text-slate-400 text-sm mt-1">
                    {selectedFrequency} • {selectedCategory}
                  </Text>
                </View>
                <View className="bg-slate-800 px-3 py-1 rounded-full">
                  <Text className="text-slate-400 text-xs font-semibold">NEW</Text>
                </View>
              </View>
            </View>
          )}

          {/* Create Button */}
          <TouchableOpacity
            onPress={handleCreateHabit}
            disabled={isLoading || !habitName.trim() || !selectedCategory}
            className={`py-5 rounded-2xl mb-4 ${
              isLoading || !habitName.trim() || !selectedCategory ? "bg-slate-700" : "bg-emerald-500"
            }`}
            style={{
              shadowColor: "#10b981",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: isLoading ? 0 : 0.4,
              shadowRadius: 12,
              elevation: isLoading ? 0 : 8,
            }}
          >
            <Text className="text-white text-center font-bold text-lg tracking-wide">
              {isLoading ? "Creating..." : "Create Habit"}
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            disabled={isLoading}
            className="bg-slate-900 py-4 rounded-2xl border-2 border-slate-800"
            style={{ opacity: isLoading ? 0.5 : 1 }}
          >
            <Text className="text-slate-300 text-center font-semibold text-base">Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
