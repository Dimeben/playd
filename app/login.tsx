// Login.tsx
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { signIn } from "@/firebase/firestore";
import { AuthContext } from "@/contexts/AuthContext";
import { isDjAccount } from "@/firebase/utils";
import { LinearGradient } from "expo-linear-gradient";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  const clearForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Error", "Please enter an email and password");
        return;
      }
      const user = await signIn(email, password);

      if (user && user.uid) {
        const userId: string = user.uid;
        setUserId(userId);
        await proceedWithLogin(userId);
      } else {
        Alert.alert("UserId cannot be retrieved, please try again.");
      }
    } catch (error) {
      Alert.alert("Login Error", "Invalid email or password");
    }
  };

  const proceedWithLogin = async (userId: string) => {
    try {
      if (!userId) {
        Alert.alert("Error", "UserID does not exist");
        return;
      }
      const isDj = await isDjAccount(userId);

      if (isDj) {
        console.log("DJ PROFILE REDIRECT");
        router.push("/(tabs)/profile");
      } else {
        console.log("USER HOME REDIRECT");
        router.push("/(tabs)/listedDjs");
      }
      clearForm();
    } catch (error) {
      Alert.alert("Login Error", "Something went wrong!");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#93C6F9", "#97B4FA", "#400691"]}
        style={styles.background}
      >
        <SafeAreaView />
        <Text style={styles.header}>Login</Text>
        <View style={styles.buttonContainer}>
          <Link href="/userSignUp" style={styles.linkButton}>
            <Text style={styles.linkText}>User Sign Up</Text>
          </Link>
          <Link href="/djSignUp" style={styles.linkButton}>
            <Text style={styles.linkText}>DJ Sign Up</Text>
          </Link>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text>{showPassword ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>

        {/* <Button title="Login" onPress={handleLogin} color="white" /> */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.linkText}>Login</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 136,
    alignSelf: "center",
    fontFamily: "menlo-bold",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: "95%",
    backgroundColor: "white",
    marginLeft: 10,
    marginRight: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    width: "95%",
    backgroundColor: "white",
    marginLeft: 10,
    marginRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
  },
  linkButton: {
    paddingRight: 40,
    paddingLeft: 40,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#007AFF",
    borderRadius: 25,
    borderRightWidth: 1,
    overflow: "hidden",
    // width: 200,
  },
  loginButton: {
    paddingRight: 40,
    paddingLeft: 40,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#007AFF",
    borderRadius: 25,
    borderRightWidth: 1,
    overflow: "hidden",
    margin: 10,
    alignSelf: "center",
  },
  linkText: {
    color: "#fff",
    fontSize: 18,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
