import { useRouter } from "expo-router";
import {
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
const backgroundImage = require("../assets/images/cyberpunk-dj-illustration.jpg");
export default function Index() {
  const router = useRouter();

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
