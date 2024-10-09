import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { getAuth } from "firebase/auth";

export default function RootLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
        },
      }}
    >
      <Tabs.Screen
        name="listedDjs"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color="white" size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="manageBookings"
        options={{
          tabBarLabel: "Manage Bookings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={24} color="white" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color="white" size={size} />
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
