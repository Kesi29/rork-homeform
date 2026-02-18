import { Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/colors";

export default function DesignersLayout() {
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
          title: "Designers",
          headerTitleStyle: {
            fontSize: 17,
            fontWeight: '600' as const,
            color: Colors.textPrimary,
          },
        }}
      />
    </Stack>
  );
}
