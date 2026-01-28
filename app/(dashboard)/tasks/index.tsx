import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Task {
  id: string;
  title: string;
  description: string;
  category: 'task' | 'game';
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

const TasksAndGames = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'tasks' | 'games'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [items, setItems] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete project documentation',
      description: 'Write comprehensive docs for the new feature',
      category: 'task',
      completed: false,
      priority: 'high',
      dueDate: 'Today',
    },
    {
      id: '2',
      title: 'Team meeting at 3 PM',
      description: 'Discuss Q1 goals and roadmap',
      category: 'task',
      completed: false,
      priority: 'medium',
      dueDate: 'Today',
    },
    {
      id: '3',
      title: 'Quick Math Quiz',
      description: 'Test your math skills in 5 minutes',
      category: 'game',
      completed: false,
      priority: 'low',
    },
    {
      id: '4',
      title: 'Memory Card Game',
      description: 'Match pairs and improve your memory',
      category: 'game',
      completed: false,
      priority: 'low',
    },
    {
      id: '5',
      title: 'Code review',
      description: 'Review pull requests from team',
      category: 'task',
      completed: true,
      priority: 'medium',
      dueDate: 'Yesterday',
    },
    {
      id: '6',
      title: 'Word Puzzle',
      description: 'Solve daily word puzzles',
      category: 'game',
      completed: false,
      priority: 'low',
    },
  ]);

  const toggleComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'tasks' && item.category === 'task') ||
      (activeTab === 'games' && item.category === 'game');
    
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const stats = {
    total: items.length,
    tasks: items.filter((i) => i.category === 'task').length,
    games: items.filter((i) => i.category === 'game').length,
    completed: items.filter((i) => i.completed).length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return { bg: '#fee2e220', text: '#ef4444', border: '#ef444420' };
      case 'medium':
        return { bg: '#fef3c720', text: '#f59e0b', border: '#f59e0b20' };
      case 'low':
        return { bg: '#dbeafe20', text: '#3b82f6', border: '#3b82f620' };
      default:
        return { bg: '#f1f5f920', text: '#64748b', border: '#64748b20' };
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="bg-slate-900 pt-16 pb-6 px-6 border-b border-slate-800">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-3xl font-bold text-white tracking-tight">
              Tasks & Games
            </Text>
            <Text className="text-slate-400 text-sm mt-1">
              Manage your work and play
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-slate-800 w-10 h-10 rounded-xl items-center justify-center border border-slate-700"
          >
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            <View className="bg-slate-800 rounded-2xl px-5 py-4 border border-slate-700">
              <Text className="text-slate-400 text-xs mb-1">Total</Text>
              <Text className="text-white text-2xl font-bold">{stats.total}</Text>
            </View>
            <View className="bg-blue-500/10 rounded-2xl px-5 py-4 border border-blue-500/20">
              <Text className="text-blue-400 text-xs mb-1">Tasks</Text>
              <Text className="text-blue-400 text-2xl font-bold">{stats.tasks}</Text>
            </View>
            <View className="bg-purple-500/10 rounded-2xl px-5 py-4 border border-purple-500/20">
              <Text className="text-purple-400 text-xs mb-1">Games</Text>
              <Text className="text-purple-400 text-2xl font-bold">{stats.games}</Text>
            </View>
            <View className="bg-emerald-500/10 rounded-2xl px-5 py-4 border border-emerald-500/20">
              <Text className="text-emerald-400 text-xs mb-1">Done</Text>
              <Text className="text-emerald-400 text-2xl font-bold">{stats.completed}</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View className="px-6 py-4 bg-slate-900 border-b border-slate-800">
        <View className="bg-slate-800 rounded-2xl flex-row items-center px-4 py-3 border border-slate-700">
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            placeholder="Search tasks or games..."
            placeholderTextColor="#64748b"
            className="flex-1 ml-3 text-white text-base"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#64748b" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Tabs */}
      <View className="px-6 py-4 bg-slate-900 border-b border-slate-800">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setActiveTab('all')}
            className={`flex-1 py-3 rounded-xl border-2 ${
              activeTab === 'all'
                ? 'bg-emerald-500 border-emerald-500'
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            <Text
              className={`text-center font-bold ${
                activeTab === 'all' ? 'text-white' : 'text-slate-400'
              }`}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('tasks')}
            className={`flex-1 py-3 rounded-xl border-2 ${
              activeTab === 'tasks'
                ? 'bg-blue-500 border-blue-500'
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            <Text
              className={`text-center font-bold ${
                activeTab === 'tasks' ? 'text-white' : 'text-slate-400'
              }`}
            >
              Tasks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('games')}
            className={`flex-1 py-3 rounded-xl border-2 ${
              activeTab === 'games'
                ? 'bg-purple-500 border-purple-500'
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            <Text
              className={`text-center font-bold ${
                activeTab === 'games' ? 'text-white' : 'text-slate-400'
              }`}
            >
              Games
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 100 }}
      >
        {filteredItems.length === 0 ? (
          <View className="items-center py-20">
            <View className="bg-slate-800 w-20 h-20 rounded-full items-center justify-center mb-4">
              <Ionicons name="folder-open-outline" size={40} color="#64748b" />
            </View>
            <Text className="text-slate-400 text-lg font-semibold">No items found</Text>
            <Text className="text-slate-500 text-sm mt-1">
              {searchQuery ? 'Try a different search' : 'Add your first task or game'}
            </Text>
          </View>
        ) : (
          filteredItems.map((item) => {
            const priorityColor = getPriorityColor(item.priority);
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() => toggleComplete(item.id)}
                className={`bg-slate-900 rounded-2xl p-5 mb-4 border-2 ${
                  item.completed ? 'border-emerald-500/20' : 'border-slate-800'
                }`}
                style={{
                  shadowColor: item.completed ? '#10b981' : '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                {/* Header */}
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1 flex-row items-center">
                    {/* Checkbox */}
                    <View
                      className={`w-6 h-6 rounded-lg border-2 items-center justify-center mr-3 ${
                        item.completed
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-slate-700'
                      }`}
                    >
                      {item.completed && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>

                    {/* Category Icon */}
                    <View
                      className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                        item.category === 'task'
                          ? 'bg-blue-500/10'
                          : 'bg-purple-500/10'
                      }`}
                    >
                      <Ionicons
                        name={item.category === 'task' ? 'clipboard-outline' : 'game-controller-outline'}
                        size={20}
                        color={item.category === 'task' ? '#3b82f6' : '#a855f7'}
                      />
                    </View>

                    {/* Priority Badge */}
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: priorityColor.bg }}
                    >
                      <Text
                        className="text-xs font-bold"
                        style={{ color: priorityColor.text }}
                      >
                        {item.priority.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={() => deleteItem(item.id)}
                    className="bg-red-500/10 w-8 h-8 rounded-lg items-center justify-center"
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                {/* Title */}
                <Text
                  className={`font-bold text-lg mb-2 ${
                    item.completed ? 'text-slate-500 line-through' : 'text-white'
                  }`}
                >
                  {item.title}
                </Text>

                {/* Description */}
                <Text
                  className={`text-sm mb-3 ${
                    item.completed ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  {item.description}
                </Text>

                {/* Footer */}
                <View className="flex-row items-center justify-between pt-3 border-t border-slate-800">
                  {item.dueDate && (
                    <View className="flex-row items-center">
                      <Ionicons name="calendar-outline" size={14} color="#64748b" />
                      <Text className="text-slate-500 text-xs ml-1">{item.dueDate}</Text>
                    </View>
                  )}
                  <View className="flex-row items-center gap-3">
                    <TouchableOpacity className="flex-row items-center">
                      <Ionicons name="time-outline" size={14} color="#64748b" />
                      <Text className="text-slate-500 text-xs ml-1">2 days</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Ionicons name="share-social-outline" size={14} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => router.push('/tasks/form')}
        activeOpacity={0.85}
        className="absolute bottom-8 right-6 bg-emerald-500 w-16 h-16 rounded-full items-center justify-center"
        style={{
          shadowColor: '#10b981',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default TasksAndGames;