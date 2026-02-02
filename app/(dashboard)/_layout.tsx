import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";

const tabs = [
  { name: "home", title: "Home", icon: "home-filled" },
   { name: "add-habit", title: "Add Habit", icon: "add-circle" },
  { name: "habits", title: "Habits", icon: "favorite" },
  { name: "progress", title: "Progress", icon: "trending-up" },
  { name: "tasks", title: "Tasks", icon: "check-circle" },
  { name: "profile", title: "Profile", icon: "person" },
] as const;

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#10b981",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopColor: "#1e293b",
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}
    >
      {tabs.map(({ name, title, icon }: any) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: title,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

