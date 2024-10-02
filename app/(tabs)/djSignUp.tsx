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
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createDJ } from "../../firebase";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function DjSignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [genre, setGenre] = useState(""); // single input for genre
  const [genres, setGenres] = useState<string[]>([]); // array for multiple genres
  const [occasion, setOccasion] = useState(""); // single input for occasion
  const [occasions, setOccasions] = useState<string[]>([]); // array for multiple occasions
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  interface CreateDJParams {
    username: string;
    city: string;
    profile_picture?: string | null;
    genres: string[];
    occasions: string[];
    price: number;
    description: string;
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
        username,
        city,
        genres,
        occasions,
        price: parseFloat(price),
        description,
        profile_picture: profilePicture,
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
    <View style={styles.container}>
      <Text style={styles.header}>DJ Registration</Text>
      <TouchableOpacity onPress={pickImage}>
        <Text>Select an Image</Text>
      </TouchableOpacity>
      <View>
        {image && (
          <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />
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
  successMessage: {
    fontSize: 20,
    color: "green",
    textAlign: "center",
    marginBottom: 20,
  },
});
