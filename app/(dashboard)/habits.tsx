import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  deleteHabit,
  getAllHabits,
  updateHabit,
  toggleHabitCompletion,
  Habit,
} from "../../services/habitService";

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(false);

  // Edit fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [frequency, setFrequency] = useState<"Daily" | "Weekly" | "Monthly">("Daily");

  // Load habits
  const loadHabits = async () => {
    setLoading(true);
    const data = await getAllHabits();
    setHabits(data);
    setLoading(false);
  };

  useEffect(() => {
    loadHabits();
  }, []);

  // Open habit modal
  const openHabit = (h: Habit) => {
    setSelected(h);
    setName(h.name);
    setDescription(h.description || "");
    setCategory(h.category);
    setFrequency(h.frequency);
  };

  // Save habit
  const onSave = async () => {
    if (!selected) return;

    setLoading(true);
    const success = await updateHabit(selected.id, {
      name,
      description,
      category,
      frequency,
    });

    setLoading(false);

    if (success) {
      Alert.alert("Success", "Habit updated successfully!");
      setSelected(null);
      loadHabits();
    } else {
      Alert.alert(
        "Error", 
        "Failed to update habit. The habit may have been deleted. Refreshing list...",
        [
          {
            text: "OK",
            onPress: () => {
              setSelected(null);
              loadHabits(); // Refresh the list
            }
          }
        ]
      );
    }
  };

  // Delete habit
  const onDelete = () => {
    if (!selected) return;

    Alert.alert("Delete Habit", "Are you sure you want to delete this habit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          const success = await deleteHabit(selected.id);
          setLoading(false);

          if (success) {
            Alert.alert("Deleted", "Habit deleted successfully!");
            setSelected(null);
            loadHabits();
          } else {
            Alert.alert(
              "Error", 
              "Failed to delete habit. It may have already been deleted. Refreshing list...",
              [
                {
                  text: "OK",
                  onPress: () => {
                    setSelected(null);
                    loadHabits(); // Refresh the list
                  }
                }
              ]
            );
          }
        },
      },
    ]);
  };

  // Toggle completion
  const toggleComplete = async (h: Habit) => {
    const success = await toggleHabitCompletion(h.id);

    if (success) {
      loadHabits();
    } else {
      Alert.alert(
        "Error", 
        "Failed to update habit. The habit may have been deleted. Refreshing list...",
        [
          {
            text: "OK",
            onPress: () => loadHabits()
          }
        ]
      );
    }
  };

  // Filtered habits
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return habits.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.description || "").toLowerCase().includes(q)
    );
  }, [habits, query]);

  // Render each habit
  const renderItem = ({ item }: { item: Habit }) => (
    <TouchableOpacity
      onPress={() => openHabit(item)}
      onLongPress={() => toggleComplete(item)}
      disabled={loading}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1e293b",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        opacity: loading ? 0.5 : 1,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          {item.name}
        </Text>
        <Text style={{ color: "#94a3b8", fontSize: 14 }}>
          {item.completed ? "✓ Completed" : item.frequency}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a", padding: 16 }}>
      <Text style={{ color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Habits
      </Text>

      <TextInput
        placeholder="Search habits..."
        placeholderTextColor="#64748b"
        value={query}
        onChangeText={setQuery}
        editable={!loading}
        style={{
          backgroundColor: "#1e293b",
          color: "white",
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
        }}
      />

      {loading && habits.length === 0 ? (
        <Text style={{ color: "#64748b", textAlign: "center", marginTop: 20 }}>
          Loading habits...
        </Text>
      ) : filtered.length === 0 ? (
        <Text style={{ color: "#64748b", textAlign: "center", marginTop: 20 }}>
          {query ? "No habits found" : "No habits yet. Add one to get started!"}
        </Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          extraData={loading}
        />
      )}

      {/* Modal */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: 20,
          }}
        >
          <View style={{ backgroundColor: "#0f172a", borderRadius: 16, padding: 20 }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
              Habit Details
            </Text>

            <TextInput
              placeholder="Name"
              placeholderTextColor="#64748b"
              value={name}
              onChangeText={setName}
              editable={!loading}
              style={{
                backgroundColor: "#1e293b",
                color: "white",
                padding: 12,
                borderRadius: 12,
                marginBottom: 12,
              }}
            />

            <TextInput
              placeholder="Description"
              placeholderTextColor="#64748b"
              value={description}
              onChangeText={setDescription}
              editable={!loading}
              multiline
              style={{
                backgroundColor: "#1e293b",
                color: "white",
                padding: 12,
                borderRadius: 12,
                marginBottom: 12,
                minHeight: 80,
              }}
            />

            <TextInput
              placeholder="Category"
              placeholderTextColor="#64748b"
              value={category}
              onChangeText={setCategory}
              editable={!loading}
              style={{
                backgroundColor: "#1e293b",
                color: "white",
                padding: 12,
                borderRadius: 12,
                marginBottom: 12,
              }}
            />

            <View style={{ flexDirection: "row", marginBottom: 16, flexWrap: "wrap" }}>
              {(["Daily", "Weekly", "Monthly"] as const).map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFrequency(f)}
                  disabled={loading}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 16,
                    marginRight: 8,
                    marginBottom: 8,
                    backgroundColor: frequency === f ? "#10b981" : "#1e293b",
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  <Text style={{ color: "white" }}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={onSave}
              disabled={loading || !name.trim()}
              style={{
                backgroundColor: loading || !name.trim() ? "#64748b" : "#3b82f6",
                padding: 14,
                borderRadius: 12,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {loading ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onDelete}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#64748b" : "#ef4444",
                padding: 14,
                borderRadius: 12,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {loading ? "Deleting..." : "Delete"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelected(null)}
              disabled={loading}
              style={{ marginTop: 8, alignItems: "center", padding: 8 }}
            >
              <Text style={{ color: "#64748b", fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}