import { AuthContext } from "@/context/AuthContext";
import { uploadImageToCloudinary } from "@/services/cloudinary";
import { subscribeToHabits } from "@/services/firestoreService";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { signOut, updateProfile } from "firebase/auth";
import { logout } from "@/services/authService";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../services/firebase";

export default function Profile() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  // Profile State
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [role, setRole] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState<Date | null>(null);

  // Debugging state
  const [snapshotActive, setSnapshotActive] = useState(false);

  // UI State
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Account Info
  const [accountCreatedDate, setAccountCreatedDate] = useState<Date | null>(
    null,
  );
  const [lastActiveDate, setLastActiveDate] = useState<Date | null>(new Date());

  // Settings State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Statistics (These should be fetched from your habit data)
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedThisMonth: 0,
    bestStreak: 0,
    achievements: 0,
  });

  // Load profile from Firestore (real-time listener)
  useEffect(() => {
    const uid = user?.uid ?? auth.currentUser?.uid;
    if (!uid) {
      console.log("No uid available yet for profile listener");
      return;
    }

    console.log(
      "Setting up realtime listener for user:",
      uid,
      "auth.currentUser:",
      auth.currentUser?.uid,
    );
    const unsub = onSnapshot(doc(db, "users", uid), (snap) => {
      try {
        console.log(
          "onSnapshot triggered: exists=%s, hasPendingWrites=%s",
          snap.exists(),
          snap.metadata.hasPendingWrites,
        );

        if (snap.exists()) {
          const data = snap.data();
          console.log("✓ Realtime user data:", data);

          const photoURL = data.photoURL || null;
          const displayNameValue = data.displayName || data.name || "";
          const emailValue = data.email || "";

          setBio(data.bio || "");
          setPhoneNumber(data.phoneNumber || "");
          setLocation(data.location || "");
          setDateOfBirth(
            data.dateOfBirth && data.dateOfBirth.toDate
              ? data.dateOfBirth.toDate().toISOString().split("T")[0]
              : data.dateOfBirth || "",
          );

          // Verify with a one-time read (helps debug rules/consistency)
          (async () => {
            try {
              const one = await getDoc(doc(db, "users", uid));
              console.log(
                "getDoc verify: exists=%s, data:",
                one.exists(),
                one.exists() ? one.data() : null,
              );
            } catch (err) {
              console.error("getDoc verification failed:", err);
            }
          })();

          // Parse createdAt robustly (supports Firestore Timestamp, Date, or string)
          let createdAtDate: Date | null = null;
          if (data.createdAt) {
            if (data.createdAt.toDate) {
              createdAtDate = data.createdAt.toDate();
            } else {
              createdAtDate = new Date(data.createdAt);
            }
          }
          setAccountCreatedDate(createdAtDate);

          // Parse updatedAt robustly (supports Firestore Timestamp, Date, or string)
          let updatedAtDate: Date | null = null;
          if (data.updatedAt) {
            if (data.updatedAt.toDate) {
              updatedAtDate = data.updatedAt.toDate();
            } else {
              updatedAtDate = new Date(data.updatedAt);
            }
          }
          setLastUpdatedDate(updatedAtDate);

          // Role
          setRole(data.role || "");

          if (data.settings) {
            setNotificationsEnabled(data.settings.notificationsEnabled ?? true);
            setRemindersEnabled(data.settings.remindersEnabled ?? true);
            setDarkModeEnabled(data.settings.darkModeEnabled ?? true);
            setSoundEnabled(data.settings.soundEnabled ?? true);
          }

          setProfileImage(photoURL);
          setDisplayName(displayNameValue);
          setUserEmail(emailValue);
        } else {
          console.log(
            "✗ No Firestore document found for user (realtime):",
            uid,
          );
          // Fallback to auth for basic fields
          const currentUser = auth.currentUser;
          if (currentUser) {
            if (currentUser.photoURL) setProfileImage(currentUser.photoURL);
            if (currentUser.displayName)
              setDisplayName(currentUser.displayName);
            if (currentUser.email) setUserEmail(currentUser.email);
          }
        }
      } catch (error) {
        console.error("Realtime profile listener error:", error);
      }
    });

    // Mark listener as active even if callback hasn't fired yet
    setSnapshotActive(true);

    return () => {
      unsub();
      setSnapshotActive(false);
    };
  }, [user?.uid, auth.currentUser?.uid]);

  // Sync Firebase Auth changes to local state
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setProfileImage(null);
      setDisplayName("");
      setUserEmail("");
      return;
    }

    console.log("Syncing Firebase Auth user:", currentUser.email);
    if (currentUser.photoURL) setProfileImage(currentUser.photoURL);
    if (currentUser.displayName) setDisplayName(currentUser.displayName);
    if (currentUser.email) setUserEmail(currentUser.email);
  }, [user?.uid]);

  // Request permissions
  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (
        cameraStatus.status !== "granted" ||
        mediaStatus.status !== "granted"
      ) {
        Alert.alert(
          "Permissions Required",
          "We need camera and media library permissions to update your profile picture.",
        );
        return false;
      }
    }
    return true;
  };

  // Take photo with camera
  const takePhoto = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        uploadProfileImage(result.assets[0].uri);
        setShowImagePickerModal(false);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        uploadProfileImage(result.assets[0].uri);
        setShowImagePickerModal(false);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  // Upload profile image to Cloudinary and Firebase
  const uploadProfileImage = async (imageUri: string) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("No user logged in - auth.currentUser is null");
      Alert.alert("Error", "No user logged in. Please login first.");
      return;
    }

    try {
      setUploading(true);
      console.log("=== START UPLOAD PROCESS ===");
      console.log("User ID:", currentUser.uid);
      console.log("User Email:", currentUser.email);

      // Step 1: Upload to Cloudinary
      console.log("Step 1: Uploading to Cloudinary...");
      const cloudImageUrl = await uploadImageToCloudinary(imageUri);
      console.log("✓ Cloudinary returned URL:", cloudImageUrl);

      if (!cloudImageUrl) {
        throw new Error("Cloudinary returned empty URL");
      }

      // Step 2: Update Firebase Auth
      console.log("Step 2: Updating Firebase Auth profile...");
      await updateProfile(currentUser, { photoURL: cloudImageUrl });
      console.log("✓ Firebase Auth photoURL updated");

      // Step 2b: RELOAD the user to persist changes
      console.log("Step 2b: Reloading Firebase Auth user...");
      await currentUser.reload();
      console.log("✓ Firebase Auth user reloaded");

      // Step 3: Save to Firestore
      console.log("Step 3: Saving to Firestore...");
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          photoURL: cloudImageUrl,
          displayName: currentUser.displayName || displayName || "",
          email: currentUser.email || "",
          updatedAt: new Date(),
        },
        { merge: true },
      );
      console.log("✓ Firestore photoURL saved");

      // Step 4: Update local state
      console.log("Step 4: Updating local state...");
      setProfileImage(cloudImageUrl);
      console.log("✓ Local state updated with photoURL:", cloudImageUrl);
      console.log("=== UPLOAD PROCESS COMPLETE ===");

      Alert.alert("Success", "Profile picture updated!");
    } catch (error: any) {
      console.error("✗ Upload Error:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });
      Alert.alert("Upload failed", error.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  // Remove profile picture
  const removeProfilePicture = () => {
    Alert.alert(
      "Remove Photo",
      "Are you sure you want to remove your profile picture?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            try {
              setUploading(true);

              // Update Firebase Auth
              await updateProfile(currentUser, { photoURL: null });
              await currentUser.reload();

              // Update Firestore
              await setDoc(
                doc(db, "users", currentUser.uid),
                { photoURL: null, updatedAt: new Date() },
                { merge: true },
              );

              setProfileImage(null);
              setShowImagePickerModal(false);
              Alert.alert("Success", "Profile picture removed!");
            } catch (error: any) {
              Alert.alert("Error", error.message);
            } finally {
              setUploading(false);
            }
          },
          style: "destructive",
        },
      ],
    );
  };

  // Update display name
  const handleUpdateProfile = async () => {
    const currentUser = auth.currentUser;

    if (!displayName.trim() || !currentUser) {
      Alert.alert("Error", "Please enter a name");
      return;
    }

    try {
      setUploading(true);

      await updateProfile(currentUser, { displayName });

      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          displayName,
          name: displayName, // ✅ Also save as 'name' field
          updatedAt: new Date(),
        },
        { merge: true },
      );

      setIsEditing(false);
      Alert.alert(
        "Success",
        "Profile updated successfully! Your name will now appear on the home screen.",
      );
    } catch (error: any) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  // Update bio
  const handleUpdateBio = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      setUploading(true);
      await setDoc(
        doc(db, "users", currentUser.uid),
        { bio, updatedAt: new Date() },
        { merge: true },
      );
      setIsEditingBio(false);
      Alert.alert("Success", "Bio updated!");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  // Update contact info
  const handleUpdateContact = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      setUploading(true);
      await setDoc(
        doc(db, "users", currentUser.uid),
        { phoneNumber, location, dateOfBirth, updatedAt: new Date() },
        { merge: true },
      );
      setIsEditingContact(false);
      Alert.alert("Success", "Contact info updated!");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  // Update settings
  const handleUpdateSettings = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          settings: {
            notificationsEnabled,
            remindersEnabled,
            darkModeEnabled,
            soundEnabled,
          },
          updatedAt: new Date(),
        },
        { merge: true },
      );
    } catch (error: any) {
      console.error("Error updating settings:", error);
    }
  };

  // Update settings whenever they change
  useEffect(() => {
    if (user?.uid) {
      handleUpdateSettings();
    }
  }, [notificationsEnabled, remindersEnabled, darkModeEnabled, soundEnabled]);

  // Clear all data
  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all habits? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            // TODO: Implement habit deletion from Firestore
            Alert.alert("Success", "All habits have been deleted.");
          },
          style: "destructive",
        },
      ],
    );
  };

  // Delete account
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure? This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const currentUser = auth.currentUser;
              if (currentUser) {
                await setDoc(
                  doc(db, "users", currentUser.uid),
                  { deleted: true, deletedAt: new Date() },
                  { merge: true },
                );
                await signOut(auth);
                router.replace("/(auth)/login");
                Alert.alert("Account Deleted", "Your account has been deleted");
              }
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  };

  // Logout (open confirmation modal)
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      // Use centralized logout (clears AsyncStorage too)
      await logout();
      router.replace("/(auth)/login");
    } catch (error: any) {
      console.error("Logout failed:", error);
      Alert.alert("Logout failed", error?.message || "Unable to logout");
    } finally {
      setShowLogoutModal(false);
    }
  };

  // --- Helpers for computing statistics ---
  const parseDate = (input: any): Date | null => {
    if (!input) return null;
    // Firestore Timestamp
    if (typeof input === "object" && typeof input.toDate === "function") {
      return input.toDate();
    }
    // Object with seconds/nanoseconds (sdk v9 serialized)
    if (input.seconds) {
      return new Date(input.seconds * 1000 + (input.nanoseconds || 0) / 1e6);
    }
    // ISO string or plain date
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  };

  const computeLongestStreakFromSet = (dateSet: Set<string>): number => {
    if (!dateSet || dateSet.size === 0) return 0;

    // Convert to sorted array
    const dates = Array.from(dateSet).sort();
    const set = new Set(dateSet);
    let longest = 0;

    for (const dateStr of dates) {
      // only start counting when previous day is NOT in set
      const prev = new Date(dateStr);
      prev.setDate(prev.getDate() - 1);
      const prevStr = prev.toISOString().split("T")[0];
      if (set.has(prevStr)) continue;

      // Count consecutive days forward
      let count = 1;
      let next = new Date(dateStr);
      while (true) {
        next.setDate(next.getDate() + 1);
        const nextStr = next.toISOString().split("T")[0];
        if (set.has(nextStr)) count++;
        else break;
      }

      longest = Math.max(longest, count);
    }

    return longest;
  };

  // Subscribe to habits and compute statistics in real-time
  useEffect(() => {
    const uid = user?.uid ?? auth.currentUser?.uid;
    const email = user?.email ?? auth.currentUser?.email;
    if (!uid && !email) return;

    const unsubscribe = subscribeToHabits(
      (habitsData) => {
        try {
          const total = habitsData.length;
          const completedTotal = habitsData.filter((h) => h.completed).length;

          const now = new Date();
          const completedThisMonth = habitsData.filter((h) => {
            if (!h.completed) return false;
            const d = parseDate((h as any).updatedAt || (h as any).createdAt);
            return (
              d &&
              d.getFullYear() === now.getFullYear() &&
              d.getMonth() === now.getMonth()
            );
          }).length;

          const completionDateSet = new Set<string>();
          habitsData.forEach((h) => {
            if (!h.completed) return;
            const d = parseDate((h as any).updatedAt || (h as any).createdAt);
            if (d && !isNaN(d.getTime()))
              completionDateSet.add(d.toISOString().split("T")[0]);
          });

          const best = computeLongestStreakFromSet(completionDateSet);
          const achievementsVal = Math.floor(completedTotal / 5);

          setStats({
            totalHabits: total,
            completedThisMonth,
            bestStreak: best,
            achievements: achievementsVal,
          });
        } catch (err) {
          console.error("Error computing stats:", err);
        }
      },
      (err) => console.error("subscribeToHabits error:", err),
      uid,
      email ?? undefined,
    );

    return () => unsubscribe();
  }, [user?.uid, auth.currentUser?.uid, user?.email, auth.currentUser?.email]);

  const badges = [
    {
      name: "First Habit",
      icon: "star",
      color: "#fbbf24",
      unlocked: stats.totalHabits >= 1,
    },
    {
      name: "Week Warrior",
      icon: "flame",
      color: "#f97316",
      unlocked: stats.bestStreak >= 7,
    },
    {
      name: "Consistency King",
      icon: "ribbon",
      color: "#ec4899",
      unlocked: stats.bestStreak >= 30,
    },
    {
      name: "All-Star",
      icon: "sparkles",
      color: "#06b6d4",
      unlocked: stats.achievements >= 5,
    },
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
            <TouchableOpacity
              onPress={() => setShowImagePickerModal(true)}
              className="relative"
              disabled={uploading}
            >
              <View className="bg-white w-28 h-28 rounded-full items-center justify-center border-4 border-emerald-700 overflow-hidden">
                {profileImage ? (
                  <Image
                    source={{ uri: `${profileImage}?t=${Date.now()}` }}
                    className="w-full h-full"
                    resizeMode="cover"
                    onError={(error) =>
                      console.error("Image load error:", error)
                    }
                    onLoadEnd={() => console.log("Image loaded successfully")}
                  />
                ) : (
                  <Ionicons name="person" size={56} color="#10b981" />
                )}
              </View>

              {/* Camera Badge */}
              <View className="absolute bottom-0 right-0 bg-emerald-500 w-10 h-10 rounded-full items-center justify-center border-4 border-white">
                {uploading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="camera" size={20} color="white" />
                )}
              </View>
            </TouchableOpacity>

            <Text className="text-white text-2xl font-bold mt-4">
              {displayName || "Anonymous"}
            </Text>
            <Text className="text-emerald-100 text-sm mt-1">{userEmail}</Text>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 pt-8">
          {/* Display Name Section */}
          {!isEditing ? (
            <View className="bg-slate-900 rounded-2xl p-6 mb-6 border-2 border-slate-800">
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-slate-300 text-sm font-semibold">
                  DISPLAY NAME
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
              <Text className="text-white text-base leading-6">
                {displayName || "Not set"}
              </Text>
            </View>
          ) : (
            <View className="bg-slate-900 rounded-2xl p-6 mb-6 border-2 border-emerald-500">
              <Text className="text-slate-300 text-sm font-semibold mb-4">
                EDIT NAME
              </Text>

              <View className="mb-6">
                <Text className="text-slate-300 text-sm font-semibold mb-2">
                  Name
                </Text>
                <TextInput
                  value={displayName}
                  onChangeText={setDisplayName}
                  className="bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700"
                  placeholderTextColor="#64748b"
                  placeholder="Enter your name"
                />
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleUpdateProfile}
                  className="flex-1 bg-emerald-500 py-3 rounded-xl items-center"
                  disabled={uploading}
                >
                  {uploading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold">Save Changes</Text>
                  )}
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

          {/* Bio Section */}
          {!isEditingBio ? (
            <View className="bg-slate-900 rounded-2xl p-6 mb-6 border-2 border-slate-800">
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-slate-300 text-sm font-semibold">
                  BIO
                </Text>
                <TouchableOpacity
                  onPress={() => setIsEditingBio(true)}
                  className="bg-emerald-500/10 px-3 py-1 rounded-full"
                >
                  <Text className="text-emerald-400 text-xs font-bold">
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="text-white text-base leading-6">
                {bio || "No bio added yet"}
              </Text>
            </View>
          ) : (
            <View className="bg-slate-900 rounded-2xl p-6 mb-6 border-2 border-emerald-500">
              <Text className="text-slate-300 text-sm font-semibold mb-4">
                EDIT BIO
              </Text>

              <View className="mb-6">
                <Text className="text-slate-300 text-sm font-semibold mb-2">
                  Bio
                </Text>
                <TextInput
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={4}
                  className="bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 text-base"
                  placeholderTextColor="#64748b"
                  placeholder="Tell us about yourself..."
                  textAlignVertical="top"
                  style={{ minHeight: 100 }}
                />
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleUpdateBio}
                  className="flex-1 bg-emerald-500 py-3 rounded-xl items-center"
                  disabled={uploading}
                >
                  {uploading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold">Save</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsEditingBio(false)}
                  className="flex-1 bg-slate-800 py-3 rounded-xl items-center border border-slate-700"
                >
                  <Text className="text-slate-300 font-bold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Contact Information */}
          {!isEditingContact ? (
            <View className="bg-slate-900 rounded-2xl p-6 mb-6 border-2 border-slate-800">
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-slate-300 text-sm font-semibold">
                  CONTACT INFORMATION
                </Text>
                <TouchableOpacity
                  onPress={() => setIsEditingContact(true)}
                  className="bg-emerald-500/10 px-3 py-1 rounded-full"
                >
                  <Text className="text-emerald-400 text-xs font-bold">
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="mb-3">
                <Text className="text-slate-400 text-xs">Phone</Text>
                <Text className="text-white text-base mt-1">
                  {phoneNumber || "Not set"}
                </Text>
              </View>

              <View className="mb-3">
                <Text className="text-slate-400 text-xs">Location</Text>
                <Text className="text-white text-base mt-1">
                  {location || "Not set"}
                </Text>
              </View>

              <View>
                <Text className="text-slate-400 text-xs">Date of Birth</Text>
                <Text className="text-white text-base mt-1">
                  {dateOfBirth || "Not set"}
                </Text>
              </View>
            </View>
          ) : (
            <View className="bg-slate-900 rounded-2xl p-6 mb-6 border-2 border-emerald-500">
              <Text className="text-slate-300 text-sm font-semibold mb-4">
                EDIT CONTACT
              </Text>

              <View className="mb-4">
                <Text className="text-slate-300 text-sm font-semibold mb-2">
                  Phone Number
                </Text>
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="+1 234 567 8900"
                  keyboardType="phone-pad"
                  className="bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700"
                  placeholderTextColor="#64748b"
                />
              </View>

              <View className="mb-4">
                <Text className="text-slate-300 text-sm font-semibold mb-2">
                  Location
                </Text>
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="City, Country"
                  className="bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700"
                  placeholderTextColor="#64748b"
                />
              </View>

              <View className="mb-6">
                <Text className="text-slate-300 text-sm font-semibold mb-2">
                  Date of Birth
                </Text>
                <TextInput
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  placeholder="YYYY-MM-DD"
                  className="bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700"
                  placeholderTextColor="#64748b"
                />
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleUpdateContact}
                  className="flex-1 bg-emerald-500 py-3 rounded-xl items-center"
                  disabled={uploading}
                >
                  {uploading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold">Save</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsEditingContact(false)}
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
              <View className="bg-slate-900 rounded-2xl p-5 border-2 border-slate-800 flex-row items-center">
                <View className="w-12 h-12 rounded-xl items-center justify-center mr-4 bg-emerald-500/20">
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-sm">Total Habits</Text>
                  <Text className="text-white text-2xl font-bold mt-1">
                    {stats.totalHabits}
                  </Text>
                </View>
              </View>

              <View className="bg-slate-900 rounded-2xl p-5 border-2 border-slate-800 flex-row items-center">
                <View className="w-12 h-12 rounded-xl items-center justify-center mr-4 bg-amber-500/20">
                  <Ionicons name="flame" size={24} color="#f59e0b" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-sm">This Month</Text>
                  <Text className="text-white text-2xl font-bold mt-1">
                    {stats.completedThisMonth}
                  </Text>
                </View>
              </View>

              <View className="bg-slate-900 rounded-2xl p-5 border-2 border-slate-800 flex-row items-center">
                <View className="w-12 h-12 rounded-xl items-center justify-center mr-4 bg-blue-500/20">
                  <Ionicons name="trending-up" size={24} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-sm">Best Streak</Text>
                  <Text className="text-white text-2xl font-bold mt-1">
                    {stats.bestStreak} days
                  </Text>
                </View>
              </View>

              <View className="bg-slate-900 rounded-2xl p-5 border-2 border-slate-800 flex-row items-center">
                <View className="w-12 h-12 rounded-xl items-center justify-center mr-4 bg-purple-500/20">
                  <Ionicons name="trophy" size={24} color="#a855f7" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-sm">Achievements</Text>
                  <Text className="text-white text-2xl font-bold mt-1">
                    {stats.achievements}
                  </Text>
                </View>
              </View>
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
                  className={`flex-1 bg-slate-900 rounded-2xl p-4 items-center border-2 min-w-[45%] ${
                    badge.unlocked
                      ? "border-slate-700"
                      : "border-slate-800 opacity-40"
                  }`}
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: `${badge.color}20` }}
                  >
                    <Ionicons
                      name={badge.icon as any}
                      size={24}
                      color={badge.unlocked ? badge.color : "#64748b"}
                    />
                  </View>
                  <Text
                    className={`text-xs text-center font-semibold ${
                      badge.unlocked ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {badge.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Account Section */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-white mb-4">Account</Text>

            <View className="bg-slate-900 rounded-2xl p-5 mb-3 border-2 border-slate-800">
              <View className="flex-row items-center">
                <View className="bg-blue-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="mail-outline" size={24} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-sm">Email</Text>
                  <Text className="text-white font-bold mt-1">{userEmail}</Text>
                </View>
              </View>
            </View>

            <View className="bg-slate-900 rounded-2xl p-5 mb-3 border-2 border-slate-800">
              <View className="flex-row items-center">
                <View className="bg-amber-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="person-outline" size={24} color="#f59e0b" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-sm">Role</Text>
                  <Text className="text-white font-bold mt-1">
                    {role || "User"}
                  </Text>
                </View>
              </View>
            </View>

            {lastUpdatedDate && (
              <View className="bg-slate-900 rounded-2xl p-5 mb-3 border-2 border-slate-800">
                <View className="flex-row items-center">
                  <View className="bg-slate-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                    <Ionicons name="time-outline" size={24} color="#94a3b8" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-400 text-sm">Last Updated</Text>
                    <Text className="text-white font-bold mt-1">
                      {lastUpdatedDate.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {accountCreatedDate && (
              <View className="bg-slate-900 rounded-2xl p-5 mb-3 border-2 border-slate-800">
                <View className="flex-row items-center">
                  <View className="bg-purple-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color="#a855f7"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-400 text-sm">Member Since</Text>
                    <Text className="text-white font-bold mt-1">
                      {accountCreatedDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                </View>
              </View>
            )}

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
                    {lastActiveDate?.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Settings Section */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-white mb-4">Settings</Text>

            {/* Notifications */}
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

            {/* Display */}
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

            {/* App */}
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

              <TouchableOpacity className="bg-slate-900 rounded-2xl p-5 mb-3 border-2 border-slate-800 flex-row items-center justify-between">
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

              <TouchableOpacity className="bg-slate-900 rounded-2xl p-5 border-2 border-slate-800 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="bg-amber-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                    <Ionicons
                      name="help-circle-outline"
                      size={24}
                      color="#f59e0b"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">
                      Help & Support
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                      Get assistance
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
                onPress={handleDeleteAccount}
                className="bg-red-500/10 rounded-2xl p-5 mb-3 border-2 border-red-500/30 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  <View className="bg-red-500/20 w-12 h-12 rounded-xl items-center justify-center mr-4">
                    <Ionicons
                      name="warning-outline"
                      size={24}
                      color="#ef4444"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-red-400 font-bold text-base">
                      Delete Account
                    </Text>
                    <Text className="text-red-300/70 text-sm mt-1">
                      Permanently remove account
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

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowLogoutModal(false)}
          className="flex-1 bg-black/60 justify-center items-center"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-slate-900 rounded-2xl p-6 w-11/12"
          >
            <Text className="text-white text-xl font-bold mb-2">Logout</Text>
            <Text className="text-slate-400 mb-4">
              Are you sure you want to logout?
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowLogoutModal(false)}
                className="flex-1 bg-slate-800 py-3 rounded-xl items-center border border-slate-700"
              >
                <Text className="text-slate-300 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmLogout}
                className="flex-1 bg-red-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">Logout</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePickerModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImagePickerModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowImagePickerModal(false)}
          className="flex-1 bg-black/60 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-slate-900 rounded-t-3xl p-6"
          >
            <View className="w-12 h-1 bg-slate-700 rounded-full self-center mb-6" />

            <Text className="text-white text-2xl font-bold mb-6">
              Profile Picture
            </Text>

            {/* Take Photo */}
            <TouchableOpacity
              onPress={takePhoto}
              disabled={uploading}
              className="bg-slate-800 rounded-2xl p-5 mb-3 border-2 border-slate-700 flex-row items-center"
            >
              <View className="bg-blue-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                <Ionicons name="camera" size={24} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-base">
                  Take Photo
                </Text>
                <Text className="text-slate-400 text-sm mt-1">
                  Use your camera
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#64748b" />
            </TouchableOpacity>

            {/* Choose from Gallery */}
            <TouchableOpacity
              onPress={pickImage}
              disabled={uploading}
              className="bg-slate-800 rounded-2xl p-5 mb-3 border-2 border-slate-700 flex-row items-center"
            >
              <View className="bg-purple-500/10 w-12 h-12 rounded-xl items-center justify-center mr-4">
                <Ionicons name="images" size={24} color="#a855f7" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-base">
                  Choose from Gallery
                </Text>
                <Text className="text-slate-400 text-sm mt-1">
                  Select from your photos
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#64748b" />
            </TouchableOpacity>

            {/* Remove Photo */}
            {profileImage && (
              <TouchableOpacity
                onPress={removeProfilePicture}
                disabled={uploading}
                className="bg-red-500/10 rounded-2xl p-5 mb-3 border-2 border-red-500/30 flex-row items-center"
              >
                <View className="bg-red-500/20 w-12 h-12 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="trash" size={24} color="#ef4444" />
                </View>
                <View className="flex-1">
                  <Text className="text-red-400 font-bold text-base">
                    Remove Photo
                  </Text>
                  <Text className="text-red-300/70 text-sm mt-1">
                    Delete current picture
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#ef4444" />
              </TouchableOpacity>
            )}

            {/* Cancel */}
            <TouchableOpacity
              onPress={() => setShowImagePickerModal(false)}
              className="bg-slate-800 rounded-2xl p-4 mt-2 items-center"
            >
              <Text className="text-slate-300 font-bold">Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
