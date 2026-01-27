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
} from "react-native";

export default function Register() {
  const router = useRouter();

  const { showLoader, hideLoader, isLoading } = useLoader(); //isloader-load vnvd ndd kiyl blgnn puluvn

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    <View className="flex-1 bg-gray-100 justify-center items-center px-6">
      {/* Card */}
      <View
        className="w-full bg-white rounded-2xl p-6"
        style={{ elevation: 5 }}
      >
          {/* Title */}
          <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create Account
          </Text>

          {/* Name */}
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Name</Text>
            <TextInput
              placeholder="Enter your name"
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              editable={true}
            />
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Email</Text>
            <TextInput
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              editable={true}
            />
          </View>

          {/* Password */}
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Password</Text>
            <TextInput
              placeholder="Enter password"
              secureTextEntry
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              editable={true}
            />
          </View>

          {/* Confirm Password */}
          <View className="mb-6">
            <Text className="text-gray-600 mb-1">Confirm Password</Text>
            <TextInput
              placeholder="Re-enter password"
              secureTextEntry
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={true}
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            className="bg-gray-800 py-3 rounded-xl mb-6 shadow-lg"
          >
            <Text className="text-white text-center font-bold text-lg">
              Register
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Already have an account?</Text>
            <Pressable onPress={() => router.back()}>
              <Text className="text-blue-600 font-semibold ml-1">Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
  
  );
}
