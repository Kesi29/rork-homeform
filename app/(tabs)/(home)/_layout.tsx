import { Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/colors";

export default function ExploreLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerShadowVisible: false,
        headerTintColor: Colors.textPrimary,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerShown: true,
          headerTitle: "",
        }}
      />
    </Stack>
  );
}
