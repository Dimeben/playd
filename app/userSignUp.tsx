import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createUser, djRef, usersRef } from "../firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { storage } from "../firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { isUsernameTaken } from "@/firebase/utils";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function UserSignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const router = useRouter();

  interface CreateUserParams {
    email?: string;
    password?: string;
    city?: string;
    username?: string;
    profile_picture?: string | null;
    first_name?: string;
    surname?: string;
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]?.uri);
    }
  };

  const uploadMedia = async () => {
    try {
      if (!image) {
        Alert.alert("No image selected");
        return;
      }

      const { uri } = await FileSystem.getInfoAsync(image);
      const blob = await new Promise<Blob>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response as Blob);
        };
        xhr.onerror = () => {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = image.substring(image.lastIndexOf("/") + 1);
      const imageRef = ref(storage, filename);
      await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(imageRef);
      setProfilePicture(url);
      Alert.alert("Photo Uploaded");
      setImage(null);
    } catch (error) {
      Alert.alert("Something went wrong. Please try again.");
    }
  };

  const clearForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setCity("");
    setFirstName("");
    setSurname("");
    setProfilePicture(null);
  };

  const handleUserRegister = async () => {
    if (!firstName || !surname || !username || !city) {
      alert("Please complete all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const usernameExists = await isUsernameTaken(
        username[0].toUpperCase() + username.substring(1),
        usersRef
      );

      if (usernameExists) {
        throw new Error("Username is already taken.");
      }

      const djUsernameExists = await isUsernameTaken(
        username[0].toUpperCase() + username.substring(1),
        djRef
      );

      if (djUsernameExists) {
        throw new Error("Username is already taken.");
      }
      await createUser(email, password, {
        username: username[0].toUpperCase() + username.substring(1),
        first_name: firstName[0].toUpperCase() + firstName.substring(1),
        surname: surname[0].toUpperCase() + surname.substring(1),
        city: city[0].toUpperCase() + city.substring(1),
        profile_picture: profilePicture,
      });

      clearForm();
      Alert.alert("User Signed Up Successfully");
      router.push("/(tabs)/listedDjs");
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An error occurred during registration.";
      Alert.alert("Error", errorMessage);
    }
  };

  if (showSuccessMessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.successMessage}>User registered successfully!</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <LinearGradient
            colors={["#00005B", "#A000CC", "#0040CC"]}
            style={styles.background}
          >
            <ScrollView contentContainerStyle={{ alignItems: "center" }}>
              <Text style={styles.header}>
                <FontAwesome5 name="compact-disc" size={30} color="white" />{" "}
                User Signup
              </Text>
              <TouchableOpacity onPress={pickImage} style={styles.signupButton}>
                <Text style={styles.linkText}>Select an Image</Text>
              </TouchableOpacity>
              <View>
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 300, height: 300 }}
                  />
                )}
              </View>
              <TouchableOpacity
                onPress={uploadMedia}
                style={styles.signupButton}
              >
                <Text style={styles.linkText}>Upload Image</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
              />

              <TextInput
                style={styles.input}
                placeholder="Surname"
                value={surname}
                onChangeText={setSurname}
              />

              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  value={password}
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.signupButton, styles.marginTop]}
                onPress={handleUserRegister}
              >
                <Text style={styles.linkText}>Register as User</Text>
              </TouchableOpacity>
            </ScrollView>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 26,
    marginTop: 20,
    fontFamily: "GeezaPro-Bold",
    alignSelf: "center",
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: "95%",
    backgroundColor: "white",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginVertical: 5,
    width: "95%",
    backgroundColor: "white",
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  successMessage: {
    fontSize: 20,
    color: "green",
    textAlign: "center",
    marginBottom: 20,
  },
  signupButton: {
    paddingRight: 40,
    paddingLeft: 40,
    paddingTop: 9,
    paddingBottom: 9,
    borderWidth: 1,
    backgroundColor: "#1c93ed",
    borderRadius: 14,
    borderRightWidth: 1,
    overflow: "hidden",
    margin: 10,
    alignSelf: "center",
    width: "85%",
  },
  linkText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  paddingLeft: {
    paddingLeft: 10,
  },
  marginTop: {
    marginTop: 15,
  },
  white: {
    color: "white",
    fontWeight: "bold",
  },
});
