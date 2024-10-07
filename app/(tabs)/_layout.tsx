import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = getAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: true,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="listedDjs"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="manageBookings"
        options={{
          tabBarLabel: "Manage Bookings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={24} color="black" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="userProfile"
        options={{
          tabBarLabel: "User Profile",
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Index",
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="bookdj"
        options={{
          tabBarLabel: "BookDj",
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="djprofile"
        options={{
          tabBarLabel: "DJ Profile",
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="editdjprofile"
        options={{
          tabBarLabel: "Edit DJ Profile",
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="EditUserProfile"
        options={{
          tabBarLabel: "Edit User Profile",
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="djManageBooking"
        options={{
          tabBarLabel: "DJ Manage Booking",
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="userManageBookings"
        options={{
          tabBarLabel: "User Manage Booking",
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
