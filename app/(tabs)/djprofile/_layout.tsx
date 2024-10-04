import { Stack, Tabs } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)/manageBooks"
            options={{ title: "Bookings" }}
          />
        </Stack>
      </AuthProvider>
    </>
  );
}
