import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loging } from "../../services/authService";
import { auth } from "../../services/firebase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validate inputs
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Attempt to login with Firebase
      await loging(email.trim(), password);

      // Reload user to ensure all data is synced
      if (auth.currentUser) {
        await auth.currentUser.reload();
        console.log("🔄 User reloaded after login");
      }

      // If successful, navigate to home
      router.replace("/home");
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific Firebase errors
      let errorMessage = "Login failed. Please try again.";

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage =
          "Invalid email or password. Please check your credentials.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage =
          "No account found with this email. Please register first.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format. Please check your email.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 64,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full">
            {/* Header Section - Centered */}
            <View className="mb-10 items-center">
              {/* Logo Container - Centered */}
              <View className="items-center mb-8">
                <View className="w-16 h-16 bg-emerald-500 rounded-2xl items-center justify-center mb-6">
                  <View className="w-10 h-10 border-4 border-white rounded-full" />
                  <View className="absolute top-5 left-5 w-7 h-3 bg-white transform rotate-45" />
                </View>

                <Text className="text-4xl font-bold text-white mb-3 tracking-tight text-center">
                  Welcome Back
                </Text>
                <Text className="text-slate-400 text-base leading-relaxed text-center">
                  Continue your journey to better habits.{"\n"}
                  Sign in to track your progress.
                </Text>
              </View>
            </View>

            {/* Form Container */}
            <View>
              {/* Email Input */}
              <View className="mb-5">
                <Text className="text-slate-300 mb-2 font-medium text-sm ml-1">
                  Email Address
                </Text>
                <View
                  className={`bg-slate-900 rounded-2xl border-2 ${
                    focusedField === "email"
                      ? "border-emerald-500"
                      : "border-slate-800"
                  }`}
                  style={{
                    shadowColor: focusedField === "email" ? "#10b981" : "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: focusedField === "email" ? 0.3 : 0.1,
                    shadowRadius: 8,
                    elevation: focusedField === "email" ? 8 : 2,
                  }}
                >
                  <TextInput
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="px-5 py-4 text-white text-base"
                    placeholderTextColor="#64748b"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    editable={true}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-8">
                <Text className="text-slate-300 mb-2 font-medium text-sm ml-1">
                  Password
                </Text>
                <View
                  className={`bg-slate-900 rounded-2xl border-2 ${
                    focusedField === "password"
                      ? "border-emerald-500"
                      : "border-slate-800"
                  }`}
                  style={{
                    shadowColor:
                      focusedField === "password" ? "#10b981" : "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: focusedField === "password" ? 0.3 : 0.1,
                    shadowRadius: 8,
                    elevation: focusedField === "password" ? 8 : 2,
                  }}
                >
                  <TextInput
                    placeholder="Enter your password"
                    secureTextEntry
                    className="px-5 py-4 text-white text-base"
                    placeholderTextColor="#64748b"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    editable={true}
                  />
                </View>
              </View>

              {/* Forgot Password Link */}
              <View className="mb-6 items-end">
                <Pressable>
                  <Text className="text-emerald-400 font-medium text-sm">
                    Forgot Password?
                  </Text>
                </Pressable>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className="bg-emerald-500 py-5 rounded-2xl mb-6"
                style={{
                  shadowColor: "#10b981",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 8,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-bold text-lg tracking-wide">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-px bg-slate-800" />
                <Text className="mx-4 text-slate-600 text-xs font-semibold tracking-wider">
                  OR
                </Text>
                <View className="flex-1 h-px bg-slate-800" />
              </View>

              {/* Register Link */}
              <View className="flex-row justify-center items-center">
                <Text className="text-slate-400 text-base">
                  Don&apos;t have an account?
                </Text>
                <Pressable onPress={() => router.push("./register")}>
                  <Text className="text-emerald-400 font-bold ml-2 text-base">
                    Register
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Footer */}
            <View className="mt-8 pt-6 border-t border-slate-800">
              <Text className="text-slate-600 text-xs text-center leading-5">
                By continuing, you agree to our{" "}
                <Text className="text-slate-500 font-medium">
                  Terms of Service
                </Text>
                {"\n"}and{" "}
                <Text className="text-slate-500 font-medium">
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
