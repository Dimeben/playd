import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Index = () => {
  return (
    <View>
      <Text>Index Screen</Text>
      <Link href="/">Home Screen</Link>
      <Link href="/(tabs)/profile">Profile Screen</Link>
      <Link href="/(tabs)/manageBookings">Manage Bookings Screen</Link>
      <Link href="/(tabs)/search">Search Screen</Link>
      <Link href="/(tabs)/login">Login Screen</Link>
    </View>
  );
};

export default Index;
