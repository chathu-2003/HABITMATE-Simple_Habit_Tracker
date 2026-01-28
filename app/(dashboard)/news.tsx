import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: string;
  image?: string;
  isBreaking?: boolean;
}

const News = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newsData, setNewsData] = useState<NewsItem[]>([
    {
      id: "1",
      title: "Breaking: Major Economic Reforms Announced",
      description:
        "Government unveils comprehensive economic package aimed at stabilizing inflation and boosting growth.",
      time: "2 mins ago",
      category: "Economy",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
      isBreaking: true,
    },
    {
      id: "2",
      title: "Weather Alert: Heavy Rainfall Expected",
      description:
        "Meteorology department issues warnings for several districts. Residents advised to take precautions.",
      time: "15 mins ago",
      category: "Weather",
      image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&q=80",
    },
    {
      id: "3",
      title: "Sports: Cricket Team Secures Victory",
      description:
        "National cricket team wins decisive match in ongoing tournament series.",
      time: "1 hour ago",
      category: "Sports",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    },
    {
      id: "4",
      title: "Technology: New Digital Initiative Launched",
      description:
        "Government launches digital transformation program to enhance public services.",
      time: "2 hours ago",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80",
    },
    {
      id: "5",
      title: "Health: Vaccination Drive Continues",
      description:
        "Health ministry reports successful progress in nationwide vaccination campaign.",
      time: "3 hours ago",
      category: "Health",
      image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80",
    },
    {
      id: "6",
      title: "Education: New Curriculum Changes",
      description:
        "Ministry of Education announces updates to school curriculum for upcoming academic year.",
      time: "4 hours ago",
      category: "Education",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    },
  ]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate fetching new data
    setTimeout(() => {
      setRefreshing(false);
      // You would fetch real news data here
    }, 2000);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Economy: "#3b82f6",
      Weather: "#f59e0b",
      Sports: "#10b981",
      Technology: "#8b5cf6",
      Health: "#ef4444",
      Education: "#ec4899",
    };
    return colors[category] || "#6366f1";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="bg-red-600 pt-16 pb-6 px-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/20 w-10 h-10 rounded-xl items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-white text-2xl font-bold tracking-tight">
              Derana News
            </Text>
          </View>
          <TouchableOpacity className="bg-white/20 w-10 h-10 rounded-xl items-center justify-center">
            <Ionicons name="notifications-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Live Indicator */}
        <View className="flex-row items-center justify-center">
          <View className="flex-row items-center bg-white/20 px-4 py-2 rounded-full">
            <View className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
            <Text className="text-white font-bold text-sm mr-3">LIVE</Text>
            <Text className="text-white text-sm">
              {formatTime(currentTime)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ef4444"
            colors={["#ef4444"]}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        {/* Breaking News Banner */}
        <View className="mb-6">
          <View className="bg-red-500 px-3 py-1 rounded-t-xl">
            <View className="flex-row items-center">
              <Ionicons name="alert-circle" size={16} color="white" />
              <Text className="text-white font-bold text-xs ml-2 tracking-wider">
                BREAKING NEWS
              </Text>
            </View>
          </View>
          <View
            className="bg-slate-900 rounded-b-2xl overflow-hidden border-2 border-red-500/20"
            style={{
              shadowColor: "#ef4444",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            {/* Breaking News Image */}
            {newsData.find((item) => item.isBreaking)?.image && (
              <Image
                source={{
                  uri: newsData.find((item) => item.isBreaking)?.image,
                }}
                className="w-full h-48"
                resizeMode="cover"
              />
            )}
            
            <View className="p-5">
              <Text className="text-white font-bold text-lg mb-2">
                {newsData.find((item) => item.isBreaking)?.title}
              </Text>
              <Text className="text-slate-400 text-sm leading-5">
                {newsData.find((item) => item.isBreaking)?.description}
              </Text>
              <View className="flex-row items-center justify-between mt-3">
                <Text className="text-red-400 text-xs font-semibold">
                  {newsData.find((item) => item.isBreaking)?.time}
                </Text>
                <TouchableOpacity>
                  <Text className="text-red-400 text-xs font-bold">
                    READ MORE →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Categories Filter */}
        <View className="mb-6">
          <Text className="text-white text-lg font-bold mb-3 tracking-tight">
            Categories
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {[
                "All",
                "Economy",
                "Weather",
                "Sports",
                "Technology",
                "Health",
              ].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  className={`px-4 py-2 rounded-xl border-2 ${
                    cat === "All"
                      ? "bg-red-500 border-red-500"
                      : "bg-slate-900 border-slate-800"
                  }`}
                >
                  <Text
                    className={`font-semibold text-sm ${
                      cat === "All" ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Latest News */}
        <View className="mb-4">
          <Text className="text-white text-lg font-bold mb-4 tracking-tight">
            Latest Updates
          </Text>

          {newsData.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              className={`bg-slate-900 rounded-2xl overflow-hidden mb-4 border-2 ${
                item.isBreaking ? "border-red-500/20" : "border-slate-800"
              }`}
              style={{
                shadowColor: item.isBreaking ? "#ef4444" : "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              {/* News Image */}
              {item.image && (
                <View className="relative">
                  <Image
                    source={{ uri: item.image }}
                    className="w-full h-44"
                    resizeMode="cover"
                  />
                  {/* Category Badge on Image */}
                  <View
                    className="absolute top-3 left-3 px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: `${getCategoryColor(item.category)}E6`,
                    }}
                  >
                    <Text className="font-bold text-xs text-white">
                      {item.category.toUpperCase()}
                    </Text>
                  </View>
                  {/* Time Badge on Image */}
                  <View className="absolute bottom-3 right-3 bg-black/70 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-semibold">
                      {item.time}
                    </Text>
                  </View>
                </View>
              )}

              <View className="p-5">
                {/* Category and Time (shown only if no image) */}
                {!item.image && (
                  <View className="flex-row items-center justify-between mb-3">
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: `${getCategoryColor(item.category)}20`,
                      }}
                    >
                      <Text
                        className="font-bold text-xs"
                        style={{ color: getCategoryColor(item.category) }}
                      >
                        {item.category.toUpperCase()}
                      </Text>
                    </View>
                    <Text className="text-slate-500 text-xs">{item.time}</Text>
                  </View>
                )}

                {/* Title */}
                <Text className="text-white font-bold text-base mb-2 leading-5">
                  {item.title}
                </Text>

                {/* Description */}
                <Text className="text-slate-400 text-sm mb-3 leading-5">
                  {item.description}
                </Text>

                {/* Actions */}
                <View className="flex-row items-center justify-between pt-3 border-t border-slate-800">
                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity className="flex-row items-center">
                      <Ionicons name="heart-outline" size={18} color="#64748b" />
                      <Text className="text-slate-500 text-xs ml-1">24</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center">
                      <Ionicons
                        name="chatbubble-outline"
                        size={18}
                        color="#64748b"
                      />
                      <Text className="text-slate-500 text-xs ml-1">12</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center">
                      <Ionicons
                        name="share-social-outline"
                        size={18}
                        color="#64748b"
                      />
                      <Text className="text-slate-500 text-xs ml-1">Share</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="bookmark-outline" size={18} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Load More Button */}
        <TouchableOpacity
          className="bg-slate-900 border-2 border-slate-800 py-4 rounded-2xl items-center mb-6"
          onPress={onRefresh}
        >
          <Text className="text-slate-300 font-bold">Load More News</Text>
        </TouchableOpacity>

        {/* Footer Info */}
        <View className="items-center py-6 border-t border-slate-800">
          <View className="flex-row items-center mb-2">
            <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
            <Text className="text-slate-400 text-sm">
              Updates every second • Derana News
            </Text>
          </View>
          <Text className="text-slate-600 text-xs">
            Last updated: {formatTime(currentTime)}
          </Text>
        </View>
      </ScrollView>

      {/* Floating Refresh Button */}
      <TouchableOpacity
        onPress={onRefresh}
        activeOpacity={0.85}
        className="absolute bottom-8 right-6 bg-red-500 w-16 h-16 rounded-full items-center justify-center"
        style={{
          shadowColor: "#ef4444",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        <Ionicons name="refresh" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default News;