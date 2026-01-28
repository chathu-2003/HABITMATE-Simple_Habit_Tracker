import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Settings() {
  const router = useRouter();
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
              Settings
            </Text>
            <Text className="text-slate-400 text-base mt-2">
              Manage your preferences
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-slate-900 w-12 h-12 rounded-xl items-center justify-center border border-slate-800"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-white mb-4">
            Notifications
          </Text>

          {/* Push Notifications */}
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

          {/* Daily Reminders */}
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

          {/* Dark Mode */}
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

          {/* Sound Effects */}
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

          {/* About */}
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
                <Text className="text-white font-bold text-base">About</Text>
                <Text className="text-slate-400 text-sm mt-1">
                  Version 1.0.0
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#64748b" />
          </TouchableOpacity>

          {/* Privacy Policy */}
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

          {/* Terms & Conditions */}
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

          {/* Clear Data */}
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

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500/10 rounded-2xl p-5 border-2 border-red-500/30 flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1">
              <View className="bg-red-500/20 w-12 h-12 rounded-xl items-center justify-center mr-4">
                <Ionicons name="log-out-outline" size={24} color="#ef4444" />
              </View>
              <View className="flex-1">
                <Text className="text-red-400 font-bold text-base">Logout</Text>
                <Text className="text-red-300/70 text-sm mt-1">
                  Sign out of your account
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
