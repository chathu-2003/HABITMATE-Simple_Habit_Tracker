import { useLoader } from "@/hooks/useLoader";
import { registerUser } from "@/services/authService";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

export default function Register() {
  const router = useRouter();
  const { showLoader, hideLoader, isLoading } = useLoader();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [focusedField, setFocusedField] = useState("");

  const handleRegister = async () => {
    if (isLoading) {
      return;
    }
    if (!name || !email || !password) {
      Alert.alert("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }
    showLoader();

    try {
      showLoader();
      await registerUser(name, email, password);
      Alert.alert("Registration Successful");
      router.replace("./login");
    } catch (err) {
      Alert.alert("Registration Failed");
    } finally {
      hideLoader();
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 64, paddingBottom: 32 }}
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
                  Create Account
                </Text>
                <Text className="text-slate-400 text-base leading-relaxed text-center">
                  Start building better habits today.{"\n"}
                  Track progress, achieve your goals.
                </Text>
              </View>
            </View>

            {/* Form Container */}
            <View>
              {/* Name Input */}
              <View className="mb-5">
                <Text className="text-slate-300 mb-2 font-medium text-sm ml-1">
                  Full Name
                </Text>
                <View
                  className={`bg-slate-900 rounded-2xl border-2 ${
                    focusedField === "name"
                      ? "border-emerald-500"
                      : "border-slate-800"
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
                    placeholder="Enter your full name"
                    className="px-5 py-4 text-white text-base"
                    placeholderTextColor="#64748b"
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField("")}
                    editable={!isLoading}
                  />
                </View>
              </View>

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
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-5">
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
                    shadowColor: focusedField === "password" ? "#10b981" : "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: focusedField === "password" ? 0.3 : 0.1,
                    shadowRadius: 8,
                    elevation: focusedField === "password" ? 8 : 2,
                  }}
                >
                  <TextInput
                    placeholder="Create a strong password"
                    secureTextEntry
                    className="px-5 py-4 text-white text-base"
                    placeholderTextColor="#64748b"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Confirm Password Input */}
              <View className="mb-8">
                <Text className="text-slate-300 mb-2 font-medium text-sm ml-1">
                  Confirm Password
                </Text>
                <View
                  className={`bg-slate-900 rounded-2xl border-2 ${
                    focusedField === "confirmPassword"
                      ? "border-emerald-500"
                      : "border-slate-800"
                  }`}
                  style={{
                    shadowColor:
                      focusedField === "confirmPassword" ? "#10b981" : "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: focusedField === "confirmPassword" ? 0.3 : 0.1,
                    shadowRadius: 8,
                    elevation: focusedField === "confirmPassword" ? 8 : 2,
                  }}
                >
                  <TextInput
                    placeholder="Re-enter your password"
                    secureTextEntry
                    className="px-5 py-4 text-white text-base"
                    placeholderTextColor="#64748b"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField("")}
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={isLoading}
                className={`py-5 rounded-2xl mb-6 ${
                  isLoading ? "bg-slate-700" : "bg-emerald-500"
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
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-px bg-slate-800" />
                <Text className="mx-4 text-slate-600 text-xs font-semibold tracking-wider">
                  OR
                </Text>
                <View className="flex-1 h-px bg-slate-800" />
              </View>

              {/* Login Link */}
              <View className="flex-row justify-center items-center">
                <Text className="text-slate-400 text-base">
                  Already have an account?
                </Text>
                <Pressable
                  onPress={() => router.push("./login")}
                  disabled={isLoading}
                >
                  <Text className="text-emerald-400 font-bold ml-2 text-base">
                    Sign In
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Footer */}
            <View className="mt-8 pt-6 border-t border-slate-800">
              <Text className="text-slate-600 text-xs text-center leading-5">
                By continuing, you agree to our{" "}
                <Text className="text-slate-500 font-medium">Terms of Service</Text>
                {"\n"}and{" "}
                <Text className="text-slate-500 font-medium">Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}