import React, { useState } from "react";
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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { signIn } from "@/firebase/firestore";
import { AuthContext } from "@/contexts/AuthContext";
import { isDjAccount } from "@/firebase/utils";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";

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
        Alert.alert("DJ Logged In Successfully");
        router.push("/(tabs)/profile");
      } else {
        Alert.alert("User Logged In Successfully");
        router.push("/(tabs)/listedDjs");
      }
      clearForm();
    } catch (error) {
      Alert.alert("Login Error", "Something went wrong!");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <LinearGradient
        colors={["#C80055", "#A000CC", "#0040CC"]}
        style={styles.background}
      >
        <Text style={styles.header}>
          <Entypo name="login" size={24} color="white" /> Login
        </Text>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
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

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "GeezaPro-Bold",
    marginTop: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 5,
    borderRadius: 12,
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
    borderRadius: 12,
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
    paddingRight: 32,
    paddingLeft: 32,
    paddingTop: 9,
    paddingBottom: 9,
    backgroundColor: "#1c93ed",
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    margin: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  loginButton: {
    paddingRight: 40,
    paddingLeft: 40,
    paddingTop: 9,
    paddingBottom: 9,
    borderWidth: 1,
    backgroundColor: "#1c93ed",
    borderRadius: 14,
    overflow: "hidden",
    margin: 10,
    alignSelf: "center",
    marginTop: 15,
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
