import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  TouchableOpacity,
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();

  const image = {
    uri: "https://img.freepik.com/free-photo/cyberpunk-dj-illustration_23-2151656032.jpg?t=st=1728052685~exp=1728056285~hmac=bbac23adf299ba2724537eedf8a8d2986e6f3d0c5dacf73c564e6767609c5762&w=826",
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.heading}>Welcome to Playd</Text>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Link href="/(tabs)/djprofile/djprofile" style={styles.text}>
            Go to Dj profile
          </Link>
          <Text> </Text>
          <Link href={`/(tabs)/profile`} style={styles.text}>
            Go to User profile
          </Link> */}

          {/* <Link href={`/(tabs)/login`} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </Link> */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push(`/(tabs)/login`)}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 30,
  },
  heading: {
    color: "white",
    fontSize: 30,
    marginTop: 30,
    alignSelf: "center",
  },
  button: {
    padding: 10,
    backgroundColor: "#007AFF",
    width: "80%",
    alignItems: "center",
    marginRight: "auto",
    marginLeft: "auto",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});
