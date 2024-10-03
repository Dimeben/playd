import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: true,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="manageBookings"
        options={{
          tabBarLabel: "Manage Bookings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name={isLoggedIn ? "djprofile" : "login"}
        options={{
          tabBarLabel: isLoggedIn ? "Dj Profile" : "Login",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={isLoggedIn ? "person-outline" : "log-in-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="djprofile"
        options={{
          tabBarLabel: "Dj Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="editdjprofile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
