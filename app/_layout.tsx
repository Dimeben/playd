import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" />
      <Tabs.Screen
        name="DjProfilePage"
        options={{
          headerShown: false,
          title: "Dj Profile",
        }}
      />
    </Tabs>
  );
}
