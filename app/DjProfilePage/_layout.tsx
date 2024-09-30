import { Stack, Tabs } from "expo-router";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // <Stack
    //   screenOptions={{
    //     headerStyle: { backgroundColor: "blue" },
    //     headerTintColor: "#eee",
    //     headerTitleStyle: { fontWeight: "bold" },
    //   }}
    // >
    //   <Stack.Screen
    //     name="index"
    //     options={{
    //       title: "Home",
    //       headerRight: () => (
    //         <Entypo
    //           name="info-with-circle"
    //           size={24}
    //           color="black"
    //           // onPress={() => Alert.alert("More info")}
    //           // onPress={() => router.push("/modal")}
    //         />
    //       ),
    //     }}
    //   />
    // </Stack>
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Dj Profile",
        }}
      />
    </Stack>
  );
}
