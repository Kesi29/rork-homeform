import { Tabs } from "expo-router";
import { Home, Search, Bookmark } from "lucide-react-native";
import React from "react";
import { StyleSheet } from "react-native";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/fonts";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.textPrimary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: Fonts.body,
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => <Home size={size - 2} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="designers"
        options={{
          title: "Designers",
          tabBarIcon: ({ color, size }) => <Search size={size - 2} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) => <Bookmark size={size - 2} color={color} strokeWidth={1.5} />,
        }}
      />
    </Tabs>
  );
}
