import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createDJ } from "../firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { storage } from "../firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function DjSignUp() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [occasion, setOccasion] = useState("");
  const [occasions, setOccasions] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  interface CreateDJParams {
    first_name: string;
    surname: string;
    username: string;
    city: string;
    profile_picture?: string | null;
    genres: string[];
    occasions: string[];
    price: number;
    description: string;
    rating: number;
  }
  const rating = 0;
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
        xhr.onerror = (e) => {
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
    setFirstName("");
    setSurname("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setCity("");
    setGenre("");
    setGenres([]);
    setOccasion("");
    setOccasions([]);
    setPrice("");
    setDescription("");
  };
  const handleDJRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    try {
      await createDJ(email, password, {
        first_name: firstName,
        surname,
        username,
        city,
        genres,
        occasions,
        price: parseFloat(price),
        description,
        profile_picture: profilePicture,
        rating,
      });
      clearForm();
      Alert.alert("DJ Signed Up Successfully");
      router.push("/(tabs)/djprofile");
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An error occurred during registration.";
      Alert.alert("Error", errorMessage);
    }
  };
  const addGenre = () => {
    if (genre && !genres.includes(genre)) {
      setGenres([...genres, genre]);
      setGenre("");
    }
  };
  const addOccasion = () => {
    if (occasion && !occasions.includes(occasion)) {
      setOccasions([...occasions, occasion]);
      setOccasion("");
    }
  };
  return (
    <LinearGradient
      colors={["#C80055", "#A000CC", "#0040CC"]}
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>
            <FontAwesome5 name="compact-disc" size={30} color="black" /> DJ
            Signup
          </Text>
          <TouchableOpacity onPress={pickImage} style={styles.signupButton}>
            <Text style={styles.linkText}>Select an Image</Text>
          </TouchableOpacity>
          <View>
            {image && (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            )}
            <TouchableOpacity onPress={uploadMedia} style={styles.signupButton}>
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
          </View>
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
          <TextInput
            style={styles.input}
            placeholder="Genre"
            value={genre}
            onChangeText={setGenre}
          />
          <Button title="Add Genre" onPress={addGenre} color="white" />
          <View>
            <Text style={styles.smalllabel}>Genres</Text>
            {genres.map((g, index) => (
              <Text key={index} style={styles.smalllabel}>
                {g}
              </Text>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Occasion"
            value={occasion}
            onChangeText={setOccasion}
          />
          <Button title="Add Occasion" onPress={addOccasion} color="white" />
          <View>
            <Text style={styles.smalllabel}>Occasions</Text>
            {occasions.map((o, index) => (
              <Text key={index} style={styles.smalllabel}>
                {o}
              </Text>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Price Per Hour"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
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
          {/* <Button
       title="Register as DJ"
       onPress={handleDJRegister}
       color="white"
      /> */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleDJRegister}
          >
            <Text style={styles.linkText}>Register as DJ</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: "white",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "GeezaPro-Bold",
    marginTop: 10,
    marginBottom: 20,
    color: "black",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: "white",
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  successMessage: {
    fontSize: 18,
    color: "green",
    marginBottom: 20,
  },
  signupButton: {
    paddingRight: 40,
    paddingLeft: 40,
    paddingTop: 9,
    paddingBottom: 9,
    backgroundColor: "#007AFF",
    borderRadius: 14,
    borderRightWidth: 1,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 15,
    alignSelf: "center",
    width: "85%",
  },
  linkText: {
    color: "#fff",
    fontSize: 18,
    alignSelf: "center",
  },
  smalllabel: {
    color: "white",
    marginBottom: 5,
  },
  imagePreview: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: "center",
  },
  white: {
    color: "white",
    fontWeight: "bold",
  },
});
