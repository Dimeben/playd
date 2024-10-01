import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
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
  );
}
