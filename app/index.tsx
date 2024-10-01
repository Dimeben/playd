import { Link, useLocalSearchParams } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text> </Text>
      <Link href="/(tabs)/djprofile">Go to Dj profile</Link>
      <Text> </Text>
      <Link href={`/(tabs)/profile`}>Go to User profile</Link>
    </View>
  );
}
