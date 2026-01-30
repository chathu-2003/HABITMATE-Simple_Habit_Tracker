import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export default function Profile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("Chathura");
  const [userEmail, setUserEmail] = useState("chathura@example.com");
  const [userBio, setUserBio] = useState(
    "Habit enthusiast building better daily routines",
  );

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all habits? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            // Clear habits from storage
            Alert.alert("Success", "All habits have been deleted.");
          },
          style: "destructive",
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          router.push("/(auth)/login");
        },
        style: "destructive",
      },
    ]);
  };

  const handleSaveProfile = () => {
    if (!userName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    Alert.alert("Success", "Profile updated successfully!");
    setIsEditing(false);
  };

  const stats = [
    {
      label: "Total Habits",
      value: "12",
      icon: "checkmark-circle",
      color: "#10b981",
    },
    { label: "This Month", value: "45", icon: "fire", color: "#f59e0b" },
    {
      label: "Best Streak",
      value: "15 days",
      icon: "trending-up",
      color: "#3b82f6",
    },
    { label: "Achievements", value: "8", icon: "trophy", color: "#a855f7" },
  ];

  const badges = [
    { name: "First Habit", icon: "star", color: "#fbbf24" },
    { name: "Week Warrior", icon: "flame", color: "#f97316" },
    { name: "Consistency King", icon: "crown", color: "#ec4899" },
    { name: "All-Star", icon: "sparkles", color: "#06b6d4" },
  ];

  return (
    <View className="flex-1 bg-slate-950">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {/* Header with Background */}
        <View className="bg-gradient-to-b from-emerald-600 to-emerald-500 pt-16 pb-8 px-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-3xl font-bold text-white tracking-tight">
              Profile
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/20 w-12 h-12 rounded-xl items-center justify-center"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Profile Picture */}
          <View className="items-center">
            <View className="bg-white w-24 h-24 rounded-full items-center justify-center mb-4 border-4 border-emerald-700">
              <Ionicons name="person" size={48} color="#10b981" />
            </View>
            <Text className="text-white text-2xl font-bold">{userName}</Text>
            <Text className="text-emerald-100 text-sm mt-1">{userEmail}</Text>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 pt-8">
          {/* Bio Section */}
          {!isEditing ? (
            <View className="bg-slate-900 rounded-2xl p-6 mb-6 border-2 border-slate-800">
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-slate-300 text-sm font-semibold">
                  BIO
                </Text>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  className="bg-emerald-500/10 px-3 py-1 rounded-full"
                >
                  <Text className="text-emerald-400 text-xs font-bold">
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="text-white text-base leading-6">{userBio}</Text>
            </View>
          ) : (
            <View className="bg-slate-900 rounded-2xl p-6 mb-6 border-2 border-emerald-500">
              <Text className="text-slate-300 text-sm font-semibold mb-4">
                EDIT PROFILE
              </Text>

              {/* Name Input */}
              <View className="mb-4">
                <Text className="text-slate-300 text-sm font-semibold mb-2">
                  Name
                </Text>
                <TextInput
                  value={userName}
                  onChangeText={setUserName}
                  className="bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700"
                  placeholderTextColor="#64748b"
                />
              </View>

              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-slate-300 text-sm font-semibold mb-2">
                  Email
                </Text>
                <TextInput
                  value={userEmail}
                  onChangeText={setUserEmail}
                  keyboardType="email-address"
                  className="bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700"
                  placeholderTextColor="#64748b"
                />
              </View>

              {/* Bio Input */}
              <View className="mb-6">
                <Text className="text-slate-300 text-sm font-semibold mb-2">
                  Bio
                </Text>
                <TextInput
                  value={userBio}
                  onChangeText={setUserBio}
                  multiline
                  numberOfLines={3}
                  className="bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 text-base"
                  placeholderTextColor="#64748b"
                  textAlignVertical="top"
                />
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleSaveProfile}
                  className="flex-1 bg-emerald-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsEditing(false)}
                  className="flex-1 bg-slate-800 py-3 rounded-xl items-center border border-slate-700"
                >
                  <Text className="text-slate-300 font-bold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Statistics Grid */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-white mb-4">
              Statistics
            </Text>
            <View className="gap-3">
              {stats.map((stat, index) => (
                <View
                  key={index}
                  className="bg-slate-900 rounded-2xl p-5 border-2 border-slate-800 flex-row items-center"
                >
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Ionicons
                      name={stat.icon as any}
                      size={24}
                      color={stat.color}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-400 text-sm">{stat.label}</Text>
                    <Text className="text-white text-2xl font-bold mt-1">
                      {stat.value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Achievements Section */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-white mb-4">
              Achievements
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {badges.map((badge, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-1 bg-slate-900 rounded-2xl p-4 items-center border-2 border-slate-800 min-w-[45%]"
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: `${badge.color}20` }}
                  >
                    <Ionicons
                      name={badge.icon as any}
                      size={24}
                      color={badge.color}
                    />
                  </View>
                  <Text className="text-slate-300 text-xs text-center font-semibold">
                    {badge.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Account Section */}
          <View>
            <Text className="text-lg font-bold text-white mb-4">Account</Text>

            {/* Member Since */}
            <View className="bg-slate-900 rounded-2xl p-5 mb-3 border-2 border-slate-800">
              <View className="flex-row items-center">
                <View className="bg-blue-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="calendar-outline" size={24} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-sm">Member Since</Text>
                  <Text className="text-white font-bold mt-1">
                    January 2024
                  </Text>
                </View>
              </View>
            </View>

            {/* Joined Date */}
            <View className="bg-slate-900 rounded-2xl p-5 border-2 border-slate-800">
              <View className="flex-row items-center">
                <View className="bg-green-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color="#10b981"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-sm">Last Active</Text>
                  <Text className="text-white font-bold mt-1">
                    Today at 2:30 PM
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Settings Section */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-white mb-4">Settings</Text>

            {/* Notifications Section */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-white mb-4">
                Notifications
              </Text>

              <View className="bg-slate-900 rounded-2xl p-5 mb-3 border-2 border-slate-800 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="bg-blue-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                    <Ionicons
                      name="notifications-outline"
                      size={24}
                      color="#3b82f6"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">
                      Push Notifications
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                      Receive habit reminders
                    </Text>
                  </View>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#64748b", true: "#10b981" }}
                  thumbColor={notificationsEnabled ? "#059669" : "#f1f5f9"}
                />
              </View>

              <View className="bg-slate-900 rounded-2xl p-5 border-2 border-slate-800 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="bg-amber-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                    <Ionicons name="alarm-outline" size={24} color="#f59e0b" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">
                      Daily Reminders
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                      9:00 AM every day
                    </Text>
                  </View>
                </View>
                <Switch
                  value={remindersEnabled}
                  onValueChange={setRemindersEnabled}
                  trackColor={{ false: "#64748b", true: "#10b981" }}
                  thumbColor={remindersEnabled ? "#059669" : "#f1f5f9"}
                />
              </View>
            </View>

            {/* Display Section */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-white mb-4">Display</Text>

              <View className="bg-slate-900 rounded-2xl p-5 mb-3 border-2 border-slate-800 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="bg-indigo-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                    <Ionicons name="moon-outline" size={24} color="#6366f1" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">
                      Dark Mode
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                      Easier on the eyes
                    </Text>
                  </View>
                </View>
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: "#64748b", true: "#10b981" }}
                  thumbColor={darkModeEnabled ? "#059669" : "#f1f5f9"}
                />
              </View>

              <View className="bg-slate-900 rounded-2xl p-5 border-2 border-slate-800 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="bg-orange-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                    <Ionicons
                      name="volume-medium-outline"
                      size={24}
                      color="#ea580c"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">
                      Sound Effects
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                      Audio feedback
                    </Text>
                  </View>
                </View>
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  trackColor={{ false: "#64748b", true: "#10b981" }}
                  thumbColor={soundEnabled ? "#059669" : "#f1f5f9"}
                />
              </View>
            </View>

            {/* App Section */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-white mb-4">App</Text>

              <TouchableOpacity className="bg-slate-900 rounded-2xl p-5 mb-3 border-2 border-slate-800 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="bg-green-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                    <Ionicons
                      name="information-circle-outline"
                      size={24}
                      color="#10b981"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">
                      About
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                      Version 1.0.0
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#64748b" />
              </TouchableOpacity>

              <TouchableOpacity className="bg-slate-900 rounded-2xl p-5 mb-3 border-2 border-slate-800 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="bg-purple-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={24}
                      color="#a855f7"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">
                      Privacy Policy
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                      Learn about your data
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#64748b" />
              </TouchableOpacity>

              <TouchableOpacity className="bg-slate-900 rounded-2xl p-5 border-2 border-slate-800 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="bg-cyan-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                    <Ionicons
                      name="document-text-outline"
                      size={24}
                      color="#06b6d4"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">
                      Terms & Conditions
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                      Our terms of service
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Danger Zone */}
            <View>
              <Text className="text-lg font-bold text-red-400 mb-4">
                Danger Zone
              </Text>

              <TouchableOpacity
                onPress={handleClearData}
                className="bg-red-500/10 rounded-2xl p-5 mb-3 border-2 border-red-500/30 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  <View className="bg-red-500/20 w-12 h-12 rounded-xl items-center justify-center mr-4">
                    <Ionicons name="trash-outline" size={24} color="#ef4444" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-red-400 font-bold text-base">
                      Clear All Data
                    </Text>
                    <Text className="text-red-300/70 text-sm mt-1">
                      Delete all habits
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#ef4444" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-500/10 rounded-2xl p-5 border-2 border-red-500/30 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  <View className="bg-red-500/20 w-12 h-12 rounded-xl items-center justify-center mr-4">
                    <Ionicons
                      name="log-out-outline"
                      size={24}
                      color="#ef4444"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-red-400 font-bold text-base">
                      Logout
                    </Text>
                    <Text className="text-red-300/70 text-sm mt-1">
                      Sign out of your account
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
