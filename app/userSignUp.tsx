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
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createUser } from "../firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { storage } from "../firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { LinearGradient } from "expo-linear-gradient";

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
  const [uploading, setUploading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

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
    setUploading(true);

    try {
      if (!image) {
        console.error("No image selected");
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
      setUploading(false);
      const url = await getDownloadURL(imageRef);
      setProfilePicture(url);
      Alert.alert("Photo Uploaded");
      setImage(null);
    } catch (error) {
      console.error(error);
      setUploading(false);
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
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      await createUser(email, password, {
        username,
        first_name: firstName,
        surname,
        city,
        profile_picture: profilePicture,
      });

      clearForm();
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
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
    <View style={styles.container}>
      <LinearGradient
        colors={["#93C6F9", "#97B4FA", "#400691"]}
        style={styles.background}
      >
        <ScrollView>
          <Text style={styles.header}>User Signup</Text>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.paddingLeft}>Select an Image</Text>
          </TouchableOpacity>
          <View>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 300, height: 300 }}
              />
            )}
            <TouchableOpacity onPress={uploadMedia} style={styles.signupButton}>
              <Text style={styles.linkText}>Upload Image</Text>
            </TouchableOpacity>
          </View>

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
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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

          {/* <Button title="Register as User" onPress={handleUserRegister} /> */}
          <TouchableOpacity
            style={[styles.signupButton, styles.marginTop]}
            onPress={handleUserRegister}
          >
            <Text style={styles.linkText}>Register as User</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
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
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 26,
    marginTop: 20,
    fontFamily: "menlo-bold",
    alignSelf: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginLeft: 8,
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
    paddingHorizontal: 10,
    marginVertical: 5,
    width: "95%",
    marginLeft: 8,

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
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#007AFF",
    borderRadius: 25,
    borderRightWidth: 1,
    overflow: "hidden",
    margin: 10,
    alignSelf: "center",
    width: "95%",
  },
  linkText: {
    color: "#fff",
    fontSize: 18,
    alignSelf: "center",
  },
  paddingLeft: {
    paddingLeft: 10,
  },
  marginTop: {
    marginTop: 15,
  },
});
