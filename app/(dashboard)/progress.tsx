import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { auth } from "../../services/firebase";
import {
  getAllHabitsFromFirestore,
  subscribeToHabits,
} from "../../services/firestoreService";
import { getAllHabits, updateHabit } from "../../services/habitService";

const { width } = Dimensions.get("window");

// Types for better type safety
interface ProgressMetrics {
  totalHabits: number;
  completedHabits: number;
  progressPercentage: number;
  streakDays: number;
  longestStreak: number;
  weeklyCompletion: number;
  monthlyCompletion: number;
  totalCompletions: number;
  averageCompletionRate: number;
}

interface CategoryStat {
  name: string;
  completed: number;
  total: number;
  percentage: number;
  color: string;
  icon: string;
}

interface WeeklyData {
  day: string;
  completed: number;
  total: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

export default function Progress() {
  const router = useRouter();
  const [habits, setHabits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<
    "week" | "month" | "all"
  >("week");

  // ============== HELPER FUNCTIONS ==============

  /**
   * Get category color based on category name
   */
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      Health: "#10b981",
      Fitness: "#f59e0b",
      Productivity: "#3b82f6",
      Mindfulness: "#a855f7",
      Learning: "#ec4899",
      Social: "#14b8a6",
      Finance: "#06b6d4",
      Creativity: "#f97316",
    };
    return colors[category] || "#64748b";
  };

  /**
   * Get category icon based on category name
   */
  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      Health: "fitness",
      Fitness: "barbell",
      Productivity: "rocket",
      Mindfulness: "leaf",
      Learning: "book",
      Social: "people",
      Finance: "cash",
      Creativity: "color-palette",
    };
    return icons[category] || "ellipse";
  };

  /**
   * Calculate comprehensive progress metrics
   */
  const calculateProgressMetrics = (habitsData: any[]): ProgressMetrics => {
    const totalHabits = habitsData.length;
    const completedHabits = habitsData.filter((h) => h.completed).length;
    const progressPercentage =
      totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

    const streakDays = calculateStreak(habitsData);
    const longestStreak = calculateLongestStreak(habitsData);
    const weeklyCompletion = calculateWeeklyCompletion(habitsData);
    const monthlyCompletion = calculateMonthlyCompletion(habitsData);
    const totalCompletions = calculateTotalCompletions(habitsData);
    const averageCompletionRate = calculateAverageCompletionRate(habitsData);

    return {
      totalHabits,
      completedHabits,
      progressPercentage,
      streakDays,
      longestStreak,
      weeklyCompletion,
      monthlyCompletion,
      totalCompletions,
      averageCompletionRate,
    };
  };

  /**
   * Calculate current streak days
   */
  const calculateStreak = (habitsData: any[]): number => {
    try {
      let streak = 0;
      const today = new Date();

      if (isNaN(today.getTime())) {
        return 0;
      }

      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);

        if (isNaN(checkDate.getTime())) {
          break;
        }

        const dateStr = checkDate.toISOString().split("T")[0];

        const completedToday = habitsData.filter((h) => {
          try {
            if (!h.createdAt) return false;

            const createdDate = new Date(h.createdAt);

            if (isNaN(createdDate.getTime())) {
              return false;
            }

            const createdDateStr = createdDate.toISOString().split("T")[0];
            return h.completed && createdDateStr === dateStr;
          } catch (e) {
            return false;
          }
        });

        if (completedToday.length > 0) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error("Error in calculateStreak:", error);
      return 0;
    }
  };

  /**
   * Calculate longest streak ever
   */
  const calculateLongestStreak = (habitsData: any[]): number => {
    try {
      let longestStreak = 0;
      let currentStreak = 0;
      const today = new Date();

      if (isNaN(today.getTime())) {
        return 0;
      }

      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);

        if (isNaN(checkDate.getTime())) {
          break;
        }

        const dateStr = checkDate.toISOString().split("T")[0];

        const completedToday = habitsData.filter((h) => {
          try {
            if (!h.createdAt) return false;

            const createdDate = new Date(h.createdAt);

            if (isNaN(createdDate.getTime())) {
              return false;
            }

            const createdDateStr = createdDate.toISOString().split("T")[0];
            return h.completed && createdDateStr === dateStr;
          } catch (e) {
            return false;
          }
        });

        if (completedToday.length > 0) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }

      return longestStreak;
    } catch (error) {
      console.error("Error in calculateLongestStreak:", error);
      return 0;
    }
  };

  /**
   * Calculate total completions
   */
  const calculateTotalCompletions = (habitsData: any[]): number => {
    return habitsData.filter((h) => h.completed).length;
  };

  /**
   * Calculate average completion rate
   */
  const calculateAverageCompletionRate = (habitsData: any[]): number => {
    if (habitsData.length === 0) return 0;
    const completed = habitsData.filter((h) => h.completed).length;
    return Math.round((completed / habitsData.length) * 100);
  };

  /**
   * Calculate weekly completion rate
   */
  const calculateWeeklyCompletion = (habitsData: any[]): number => {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      if (isNaN(weekAgo.getTime())) {
        return 0;
      }

      const recentHabits = habitsData.filter((h) => {
        try {
          if (!h.createdAt) return false;

          const createdDate = new Date(h.createdAt);

          if (isNaN(createdDate.getTime())) {
            return false;
          }

          return createdDate >= weekAgo;
        } catch (e) {
          return false;
        }
      });

      if (recentHabits.length === 0) return 0;
      const completed = recentHabits.filter((h) => h.completed).length;
      return Math.round((completed / recentHabits.length) * 100);
    } catch (error) {
      console.error("Error in calculateWeeklyCompletion:", error);
      return 0;
    }
  };

  /**
   * Calculate monthly completion rate
   */
  const calculateMonthlyCompletion = (habitsData: any[]): number => {
    try {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);

      if (isNaN(monthAgo.getTime())) {
        return 0;
      }

      const recentHabits = habitsData.filter((h) => {
        try {
          if (!h.createdAt) return false;

          const createdDate = new Date(h.createdAt);

          if (isNaN(createdDate.getTime())) {
            return false;
          }

          return createdDate >= monthAgo;
        } catch (e) {
          return false;
        }
      });

      if (recentHabits.length === 0) return 0;
      const completed = recentHabits.filter((h) => h.completed).length;
      return Math.round((completed / recentHabits.length) * 100);
    } catch (error) {
      console.error("Error in calculateMonthlyCompletion:", error);
      return 0;
    }
  };

  /**
   * Get weekly progress data for chart
   */
  const getWeeklyProgressData = (habitsData: any[]): WeeklyData[] => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const weekData: WeeklyData[] = [];

    try {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Validate date before calling toISOString
        if (isNaN(date.getTime())) {
          weekData.push({
            day: days[date.getDay()] || "Unknown",
            completed: 0,
            total: 0,
          });
          continue;
        }

        const dateStr = date.toISOString().split("T")[0];
        const dayName = days[date.getDay()];

        const dayHabits = habitsData.filter((h) => {
          try {
            if (!h.createdAt) return false;

            const createdDate = new Date(h.createdAt);

            // Validate createdDate before calling toISOString
            if (isNaN(createdDate.getTime())) {
              return false;
            }

            const createdDateStr = createdDate.toISOString().split("T")[0];
            return createdDateStr === dateStr;
          } catch (error) {
            console.warn("Error processing habit date:", error);
            return false;
          }
        });

        const completed = dayHabits.filter((h) => h.completed).length;

        weekData.push({
          day: dayName,
          completed,
          total: dayHabits.length,
        });
      }
    } catch (error) {
      console.error("Error in getWeeklyProgressData:", error);
      // Return empty week data if there's an error
      return days.map((day) => ({ day, completed: 0, total: 0 }));
    }

    return weekData;
  };

  /**
   * Group habits by category with stats
   */
  const getCategoryProgress = (habitsData: any[]): CategoryStat[] => {
    const habitsByCategory = habitsData.reduce(
      (acc, habit) => {
        if (!acc[habit.category]) {
          acc[habit.category] = [];
        }
        acc[habit.category].push(habit);
        return acc;
      },
      {} as Record<string, any[]>,
    );

    return Object.entries(habitsByCategory).map(
      ([category, categoryHabits]) => {
        const items = categoryHabits as any[];
        const total = items.length;
        const completed = items.filter((h) => h.completed).length;
        const percentage =
          total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
          name: category,
          completed,
          total,
          percentage,
          color: getCategoryColor(category),
          icon: getCategoryIcon(category),
        };
      },
    );
  };

  /**
   * Get achievements based on progress
   */
  const getAchievements = (metrics: ProgressMetrics): Achievement[] => {
    return [
      {
        id: "1",
        title: "First Step",
        description: "Complete your first habit",
        icon: "footsteps",
        color: "#10b981",
        unlocked: metrics.totalCompletions >= 1,
      },
      {
        id: "2",
        title: "Week Warrior",
        description: "Maintain a 7-day streak",
        icon: "flame",
        color: "#f59e0b",
        unlocked: metrics.streakDays >= 7,
      },
      {
        id: "3",
        title: "Perfect Day",
        description: "Complete all habits in a day",
        icon: "star",
        color: "#3b82f6",
        unlocked: metrics.progressPercentage === 100,
      },
      {
        id: "4",
        title: "Consistency King",
        description: "Reach a 30-day streak",
        icon: "trophy",
        color: "#a855f7",
        unlocked: metrics.streakDays >= 30,
      },
      {
        id: "5",
        title: "Habit Master",
        description: "Complete 100 total habits",
        icon: "ribbon",
        color: "#ec4899",
        unlocked: metrics.totalCompletions >= 100,
      },
      {
        id: "6",
        title: "Unstoppable",
        description: "Achieve 90% completion rate",
        icon: "rocket",
        color: "#14b8a6",
        unlocked: metrics.averageCompletionRate >= 90,
      },
    ];
  };

  /**
   * Get performance insight message
   */
  const getPerformanceInsights = (metrics: ProgressMetrics): string => {
    const { progressPercentage, streakDays, completedHabits } = metrics;

    if (progressPercentage === 100 && streakDays >= 7) {
      return "🔥 Incredible! You're on fire with a perfect streak!";
    } else if (progressPercentage === 100) {
      return "🎉 Perfect score today! You're crushing it!";
    } else if (progressPercentage >= 75) {
      return "💪 Almost there! Just a few more to go!";
    } else if (progressPercentage >= 50) {
      return "🚀 Great progress! Keep the momentum going!";
    } else if (completedHabits > 0) {
      return "⭐ Good start! Every step counts!";
    } else {
      return "💡 Ready to build better habits? Start now!";
    }
  };

  /**
   * Toggle habit completion status
   */
  const handleCompleteHabit = async (habitId: string) => {
    try {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) {
        console.error("Habit not found:", habitId);
        return;
      }

      // Toggle completion status
      const updatedCompleted = !habit.completed;

      // Update in Firestore
      const success = await updateHabit(habitId, {
        completed: updatedCompleted,
      });

      if (success) {
        console.log(
          `✅ Habit "${habit.name}" marked as ${updatedCompleted ? "completed" : "incomplete"}`,
        );
      }
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  /**
   * Get motivational quote based on progress
   */
  const getMotivationalQuote = (
    metrics: ProgressMetrics,
  ): { quote: string; author: string } => {
    const quotes = [
      {
        quote:
          "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
        author: "Aristotle",
      },
      {
        quote:
          "Success is the sum of small efforts repeated day in and day out.",
        author: "Robert Collier",
      },
      {
        quote:
          "You'll never change your life until you change something you do daily.",
        author: "John C. Maxwell",
      },
      {
        quote:
          "Motivation is what gets you started. Habit is what keeps you going.",
        author: "Jim Ryun",
      },
      {
        quote: "The secret of getting ahead is getting started.",
        author: "Mark Twain",
      },
    ];

    const index = Math.floor(metrics.streakDays % quotes.length);
    return quotes[index];
  };

  // Memoized calculations
  const metrics = useMemo(() => calculateProgressMetrics(habits), [habits]);
  const categoryProgress = useMemo(() => getCategoryProgress(habits), [habits]);
  const weeklyData = useMemo(() => getWeeklyProgressData(habits), [habits]);
  const achievements = useMemo(() => getAchievements(metrics), [metrics]);
  const performanceInsight = useMemo(
    () => getPerformanceInsights(metrics),
    [metrics],
  );
  const motivationalQuote = useMemo(
    () => getMotivationalQuote(metrics),
    [metrics],
  );

  // Load habits with real-time updates
  const { user } = useContext(AuthContext);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let mounted = true;

    const setupListener = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const uid = user?.uid ?? auth.currentUser?.uid;
        const email = user?.email ?? auth.currentUser?.email;

        if (!uid && !email) {
          // No user yet — show local data if any
          const localHabits = await getAllHabits();
          if (mounted) {
            setHabits(localHabits);
            setIsLoading(false);
          }
          return;
        }

        unsubscribe = subscribeToHabits(
          (firestoreHabits) => {
            if (mounted) {
              setHabits(firestoreHabits);
              setIsLoading(false);
            }
          },
          (error) => {
            if (mounted) {
              setError("Failed to load from Firestore, using local data");
              const loadLocal = async () => {
                try {
                  const localHabits = await getAllHabits();
                  if (mounted) {
                    setHabits(localHabits);
                    setIsLoading(false);
                  }
                } catch (localError) {
                  if (mounted) {
                    setError("Failed to load habits");
                    setIsLoading(false);
                  }
                }
              };
              loadLocal();
            }
          },
          // Pass user filters so listener returns only current user's habits
          uid,
          email ?? undefined,
        );
      } catch (error) {
        if (mounted) {
          setError("Connection error");
          setIsLoading(false);
        }
      }
    };

    setupListener();

    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.uid, user?.email, auth.currentUser?.uid, auth.currentUser?.email]);

  useFocusEffect(
    React.useCallback(() => {
      const refreshHabits = async () => {
        try {
          const uid = user?.uid ?? auth.currentUser?.uid;
          const email = user?.email ?? auth.currentUser?.email;
          const firestoreHabits = await getAllHabitsFromFirestore(
            uid,
            email ?? undefined,
          );
          setHabits(firestoreHabits);
          setError(null);
          setIsLoading(false);
        } catch (firestoreErr) {
          try {
            const localHabits = await getAllHabits();
            setHabits(localHabits);
            setError(localHabits.length === 0 ? "No habits found" : null);
            setIsLoading(false);
          } catch (localErr) {
            setError("Failed to refresh habits");
            setIsLoading(false);
          }
        }
      };
      refreshHabits();
    }, [user?.uid, user?.email]),
  );

  // Render Functions
  const renderHeader = () => (
    <View className="mb-6 flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-4xl font-bold text-white tracking-tight">
          Your Progress
        </Text>
        <Text className="text-slate-400 text-base mt-2">
          Track your journey to better habits
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-slate-900 w-12 h-12 rounded-xl items-center justify-center border border-slate-800"
      >
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderOverallProgress = () => (
    <View
      className="rounded-3xl p-6 mb-6"
      style={{
        backgroundColor:
          metrics.progressPercentage === 100 ? "#10b981" : "#1e293b",
        borderWidth: 2,
        borderColor: metrics.progressPercentage === 100 ? "#10b981" : "#334155",
      }}
    >
      <View className="flex-row justify-between items-start mb-6">
        <View className="flex-1">
          <Text
            className={`${metrics.progressPercentage === 100 ? "text-emerald-100" : "text-slate-400"} text-sm font-bold tracking-wider`}
          >
            TODAY'S PROGRESS
          </Text>
          <Text className="text-white text-6xl font-bold mt-2">
            {metrics.progressPercentage}%
          </Text>
          <Text
            className={`${metrics.progressPercentage === 100 ? "text-emerald-100" : "text-slate-400"} text-base mt-2`}
          >
            {metrics.completedHabits} of {metrics.totalHabits} completed
          </Text>
        </View>
        <View
          className={`${metrics.progressPercentage === 100 ? "bg-white/20" : "bg-emerald-500/10"} rounded-2xl p-4`}
        >
          <Ionicons
            name={metrics.progressPercentage === 100 ? "trophy" : "trending-up"}
            size={40}
            color={metrics.progressPercentage === 100 ? "white" : "#10b981"}
          />
        </View>
      </View>

      {/* Progress Bar */}
      <View className="bg-slate-800/50 h-4 rounded-full overflow-hidden mb-4">
        <View
          className={
            metrics.progressPercentage === 100 ? "bg-white" : "bg-emerald-500"
          }
          style={{
            width: `${metrics.progressPercentage}%`,
            height: "100%",
            borderRadius: 999,
          }}
        />
      </View>

      {/* Insight */}
      <View
        className={`${metrics.progressPercentage === 100 ? "bg-white/10" : "bg-emerald-500/10"} rounded-xl p-4`}
      >
        <Text
          className={`${metrics.progressPercentage === 100 ? "text-white" : "text-emerald-400"} font-semibold text-center`}
        >
          {performanceInsight}
        </Text>
      </View>
    </View>
  );

  const renderStreakCard = () => (
    <View className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 mb-6">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <Ionicons name="flame" size={28} color="#fbbf24" />
            <Text className="text-white text-lg font-bold ml-2">Streak</Text>
          </View>
          <Text className="text-white text-5xl font-bold mb-1">
            {metrics.streakDays}
          </Text>
          <Text className="text-orange-100 text-base">
            {metrics.streakDays === 1 ? "day" : "days"} in a row
          </Text>
          {metrics.longestStreak > metrics.streakDays && (
            <Text className="text-orange-200 text-sm mt-2">
              Best: {metrics.longestStreak} days
            </Text>
          )}
        </View>
        <View className="items-center">
          <View className="bg-white/20 rounded-full w-20 h-20 items-center justify-center">
            <Text className="text-white text-3xl">🔥</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderWeeklyChart = () => {
    const maxCompleted = Math.max(...weeklyData.map((d) => d.completed), 1);

    return (
      <View className="bg-slate-900 rounded-3xl p-6 mb-6 border-2 border-slate-800">
        <Text className="text-white text-xl font-bold mb-4">
          Weekly Overview
        </Text>
        <View
          className="flex-row justify-between items-end"
          style={{ height: 120 }}
        >
          {weeklyData.map((day, index) => {
            const heightPercentage = (day.completed / maxCompleted) * 100;
            const isToday = index === 6;

            return (
              <View key={index} className="flex-1 items-center">
                <View className="flex-1 justify-end w-full px-1">
                  <View
                    className={isToday ? "bg-emerald-500" : "bg-slate-700"}
                    style={{
                      height: `${heightPercentage}%`,
                      minHeight: day.completed > 0 ? 8 : 0,
                      borderRadius: 8,
                    }}
                  />
                </View>
                <Text
                  className={`text-xs mt-2 ${isToday ? "text-emerald-400 font-bold" : "text-slate-500"}`}
                >
                  {day.day}
                </Text>
                <Text className="text-slate-400 text-xs">
                  {day.completed}/{day.total}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderStats = () => (
    <View className="mb-6">
      <Text className="text-2xl font-bold text-white mb-4">Statistics</Text>

      <View className="flex-row gap-3 mb-3">
        <View className="flex-1 bg-slate-900 rounded-2xl p-4 border-2 border-emerald-500/20">
          <Ionicons name="checkmark-circle" size={28} color="#10b981" />
          <Text className="text-white font-bold text-2xl mt-2">
            {metrics.completedHabits}
          </Text>
          <Text className="text-slate-400 text-xs">Completed Today</Text>
        </View>

        <View className="flex-1 bg-slate-900 rounded-2xl p-4 border-2 border-amber-500/20">
          <Ionicons name="hourglass" size={28} color="#f59e0b" />
          <Text className="text-white font-bold text-2xl mt-2">
            {metrics.totalHabits - metrics.completedHabits}
          </Text>
          <Text className="text-slate-400 text-xs">Remaining</Text>
        </View>
      </View>

      <View className="flex-row gap-3 mb-3">
        <View className="flex-1 bg-slate-900 rounded-2xl p-4 border-2 border-blue-500/20">
          <Ionicons name="calendar" size={28} color="#3b82f6" />
          <Text className="text-white font-bold text-2xl mt-2">
            {metrics.weeklyCompletion}%
          </Text>
          <Text className="text-slate-400 text-xs">7 Days Avg</Text>
        </View>

        <View className="flex-1 bg-slate-900 rounded-2xl p-4 border-2 border-purple-500/20">
          <Ionicons name="analytics" size={28} color="#a855f7" />
          <Text className="text-white font-bold text-2xl mt-2">
            {metrics.monthlyCompletion}%
          </Text>
          <Text className="text-slate-400 text-xs">30 Days Avg</Text>
        </View>
      </View>

      <View className="bg-slate-900 rounded-2xl p-4 border-2 border-teal-500/20">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="sparkles" size={28} color="#14b8a6" />
            <View className="ml-3">
              <Text className="text-white font-bold text-xl">
                {metrics.totalCompletions}
              </Text>
              <Text className="text-slate-400 text-xs">Total Completions</Text>
            </View>
          </View>
          <View className="bg-teal-500/10 px-3 py-1 rounded-full">
            <Text className="text-teal-400 font-bold">
              {metrics.averageCompletionRate}% avg
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCategoryProgress = () => (
    <View className="mb-6">
      <Text className="text-2xl font-bold text-white mb-4">By Category</Text>
      {categoryProgress.map((cat, index) => (
        <View
          key={index}
          className="bg-slate-900 rounded-2xl p-5 mb-3 border-2 border-slate-800"
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center flex-1">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: `${cat.color}20` }}
              >
                <Ionicons name={cat.icon as any} size={20} color={cat.color} />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-base">
                  {cat.name}
                </Text>
                <Text className="text-slate-400 text-xs">
                  {cat.completed} of {cat.total} habits
                </Text>
              </View>
            </View>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: `${cat.color}20` }}
            >
              <Text className="font-bold text-sm" style={{ color: cat.color }}>
                {cat.percentage}%
              </Text>
            </View>
          </View>

          <View className="bg-slate-800 h-2 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${cat.percentage}%`,
                backgroundColor: cat.color,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );

  const renderAchievements = () => {
    const unlockedCount = achievements.filter((a) => a.unlocked).length;

    return (
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-white">Achievements</Text>
          <View className="bg-slate-800 px-3 py-1 rounded-full">
            <Text className="text-slate-400 text-xs font-bold">
              {unlockedCount}/{achievements.length}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-3">
          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              className={`rounded-2xl p-4 ${achievement.unlocked ? "" : "opacity-40"}`}
              style={{
                width: (width - 72) / 2,
                backgroundColor: achievement.unlocked
                  ? `${achievement.color}20`
                  : "#1e293b",
                borderWidth: 2,
                borderColor: achievement.unlocked
                  ? achievement.color
                  : "#334155",
              }}
            >
              <View className="items-center">
                <View
                  className="w-14 h-14 rounded-full items-center justify-center mb-3"
                  style={{
                    backgroundColor: achievement.unlocked
                      ? `${achievement.color}30`
                      : "#334155",
                  }}
                >
                  <Ionicons
                    name={achievement.icon as any}
                    size={28}
                    color={achievement.unlocked ? achievement.color : "#64748b"}
                  />
                </View>
                <Text
                  className="font-bold text-center mb-1"
                  style={{
                    color: achievement.unlocked ? achievement.color : "#64748b",
                  }}
                >
                  {achievement.title}
                </Text>
                <Text className="text-slate-400 text-xs text-center">
                  {achievement.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderMotivation = () => (
    <View className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-6 mb-6">
      <View className="items-center">
        <Ionicons name="bulb" size={32} color="#fbbf24" />
        <Text className="text-purple-200 text-center italic mt-4 text-base leading-6">
          "{motivationalQuote.quote}"
        </Text>
        <Text className="text-purple-300 text-center mt-3 font-semibold">
          — {motivationalQuote.author}
        </Text>
      </View>
    </View>
  );

  // Main Render
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
        {renderHeader()}

        {error && (
          <View className="bg-red-900/20 border border-red-500 rounded-2xl p-4 mb-6">
            <Text className="text-red-300 font-semibold">{error}</Text>
          </View>
        )}

        {isLoading && habits.length === 0 ? (
          <View
            className="bg-slate-900 rounded-3xl p-8 border-2 border-slate-800 items-center justify-center"
            style={{ minHeight: 200 }}
          >
            <Ionicons name="hourglass-outline" size={48} color="#64748b" />
            <Text className="text-slate-300 text-xl font-bold mt-4">
              Loading Your Progress...
            </Text>
          </View>
        ) : metrics.totalHabits > 0 ? (
          <>
            {renderOverallProgress()}
            {metrics.streakDays > 0 && renderStreakCard()}
            {renderWeeklyChart()}
            {renderStats()}
            {categoryProgress.length > 0 && renderCategoryProgress()}
            {renderAchievements()}
            {renderMotivation()}
          </>
        ) : (
          <View
            className="bg-slate-900 rounded-3xl p-8 border-2 border-slate-800 items-center justify-center"
            style={{ minHeight: 200 }}
          >
            <Ionicons name="bar-chart-outline" size={48} color="#64748b" />
            <Text className="text-slate-300 text-xl font-bold mt-4">
              No Progress Yet
            </Text>
            <Text className="text-slate-400 text-center mt-2">
              Start adding habits to track your amazing journey!
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-emerald-500 px-6 py-3 rounded-xl mt-4"
            >
              <Text className="text-white font-bold">Add Your First Habit</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
