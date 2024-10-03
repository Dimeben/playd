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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, userId, username } = useContext(AuthContext);

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
      await signIn(email, password);

      const checkUserId = () => {
        if (userId) {
          proceedWithLogin(userId);
        } else {
          setTimeout(checkUserId, 500);
        }
      };

      checkUserId();
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
        router.push("/(tabs)/djprofile");
        clearForm();
      } else {
        router.push("/(tabs)/profile");
        clearForm();
      }
    } catch (error) {
      Alert.alert("Login Error", "Something went wrong!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <View style={styles.buttonContainer}>
        <Link href="/(tabs)/userSignUp" style={styles.linkButton}>
          <Text style={styles.linkText}>User Sign Up</Text>
        </Link>
        <Link href="/(tabs)/djSignUp" style={styles.linkButton}>
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

      <Button title="Login" onPress={handleLogin} />
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    width: "100%",
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
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  linkText: {
    color: "#fff",
  },
});
