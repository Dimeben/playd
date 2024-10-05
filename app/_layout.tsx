import { Stack, Tabs } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="index"
            options={{ title: "Landing Page", headerShown: false }}
          />

          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthProvider>
    </>
  );
}
