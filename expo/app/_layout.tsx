import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { BodoniModa_400Regular, BodoniModa_500Medium, BodoniModa_600SemiBold, BodoniModa_700Bold, BodoniModa_400Regular_Italic } from "@expo-google-fonts/bodoni-moda";
import { SpaceMono_400Regular, SpaceMono_700Bold } from "@expo-google-fonts/space-mono";
import { AuthProvider } from "@/contexts/AuthContext";
import { SaveProvider } from "@/contexts/SaveContext";
import { DataProvider } from "@/contexts/DataContext";
import AuthModal from "@/components/AuthModal";
import AuthSaveBridge from "@/components/AuthSaveBridge";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: Colors.background },
        headerShadowVisible: false,
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: {
          fontFamily: Fonts.headingMedium,
        },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="image/[id]"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="designer/[id]"
        options={{
          title: "",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="admin"
        options={{
          title: "Admin",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTitleStyle: {
            fontSize: 17,
            fontFamily: Fonts.headingSemiBold,
            color: Colors.textPrimary,
          },
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BodoniModa_400Regular,
    BodoniModa_500Medium,
    BodoniModa_600SemiBold,
    BodoniModa_700Bold,
    BodoniModa_400Regular_Italic,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
          <DataProvider>
            <AuthProvider>
              <SaveProvider>
                <AuthSaveBridge />
                <RootLayoutNav />
                <AuthModal />
              </SaveProvider>
            </AuthProvider>
          </DataProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
