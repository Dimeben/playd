import { Stack, Tabs } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
  return (
<AuthProvider>
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, href: null }}
      />
      <Stack.Screen
        name="index"
        options={{ title: "Dj Profile", href: null }}
      />

      <Stack.Screen name="+not-found" />
    </Stack>
</AuthProvider>
  );
}
