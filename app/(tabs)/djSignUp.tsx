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
import { createDJ } from "../../firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { storage } from "../../firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function DjSignUp() {
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
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

  if (showSuccessMessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.successMessage}>DJ registered successfully!</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>DJ Registration</Text>

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

          <TouchableOpacity onPress={pickImage}>
            <Text>Select an Image</Text>
          </TouchableOpacity>
          <View>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 300, height: 300 }}
              />
            )}
            <TouchableOpacity onPress={uploadMedia}>
              <Text>Upload Image</Text>
            </TouchableOpacity>
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
          <Button title="Add Genre" onPress={addGenre} />

          <View>
            <Text>Genres:</Text>
            {genres.map((g, index) => (
              <Text key={index}>{g}</Text>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Occasion"
            value={occasion}
            onChangeText={setOccasion}
          />
          <Button title="Add Occasion" onPress={addOccasion} />

          <View>
            <Text>Occasions:</Text>
            {occasions.map((o, index) => (
              <Text key={index}>{o}</Text>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Price"
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

          <Button title="Register as DJ" onPress={handleDJRegister} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  successMessage: {
    fontSize: 18,
    color: "green",
    marginBottom: 20,
  },
});
