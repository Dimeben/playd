import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const profile = () => {
  return (
    <View>
      <Text>Profile Screen</Text>
      <Link href="/users/1">Go to Users Screen</Link>
    </View>
  );
};

export default profile;
