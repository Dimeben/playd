import { View, Text } from "react-native";
import React from "react";
import { Link, useLocalSearchParams } from "expo-router";

const Users = () => {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Users - {id}</Text>
      <Link href="/">Back</Link>
    </View>
  );
};

export default Users;
