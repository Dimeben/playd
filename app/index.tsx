import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  TouchableOpacity,
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import backgroundImage from "../assets/images/cyberpunk-dj-illustration.jpg";
export default function Index() {
  const router = useRouter();

  const image = {
    uri: "https://img.freepik.com/free-photo/cyberpunk-dj-illustration_23-2151656032.jpg?t=st=1728403380~exp=1728406980~hmac=d5d250d038fbccd00c02e3da06e15057250fcb57514bf30927303c56d1bbf60e&w=826",
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.image}
      >
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
            onPress={() => router.push("/login")}
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
    fontFamily: "Menlo-Bold",
  },
  heading: {
    color: "white",
    fontSize: 30,
    // fontFamily: "MarkerFelt-Wide",
    fontFamily: "Menlo-Bold",
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
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontFamily: "Menlo-Bold",
  },
});
