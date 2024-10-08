import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "../../contexts/AuthContext";
import { patchDJ, getDJById } from "@/firebase/firestore";
import { DJ } from "../../firebase/types";

const EditDjProfile = () => {
  const router = useRouter();
  const { userId } = useContext(AuthContext);

  const [dj, setDj] = useState<DJ | null>(null);

  const [updateFirstName, setUpdateFirstName] = useState("");
  const [updateSurname, setUpdateSurname] = useState("");
  const [updateCity, setUpdateCity] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [occasions, setOccasions] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState("");
  const [occasion, setOccasion] = useState("");
  const [updatePrice, setUpdatePrice] = useState<number | undefined>(undefined);
  const [updateDescription, setUpdateDescription] = useState("");
  const [goBackIsVisible, setGoBackIsVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDjData = async () => {
      if (userId) {
        try {
          const djData = await getDJById(userId);
          if (djData) {
            setDj(djData);
            setGenres(djData.genres || []);
            setOccasions(djData.occasions || []);
          }
        } catch (err) {
          console.error("Error fetching DJ data:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDjData();
  }, [userId]);

  const handleSubmit = async () => {
    if (!dj) return;

    try {
      if (userId) {
        const updatedData: DJ = {
          username: dj.username,
          first_name: updateFirstName || dj.first_name,
          surname: updateSurname || dj.surname,
          city: updateCity || dj.city,
          price: updatePrice !== undefined ? updatePrice : dj.price,
          description: updateDescription || dj.description,
          genres: genres.length > 0 ? genres : dj.genres,
          occasions: occasions.length > 0 ? occasions : dj.occasions,
          rating: dj.rating,
          profile_picture: dj.profile_picture,
        };

        await patchDJ(userId, updatedData);
        setGoBackIsVisible(true);
        Alert.alert("Profile successfully updated!");
      } else {
        Alert.alert("Error", "User ID is not available.");
      }
    } catch (err) {
      console.log("Error updating profile:", err);
    }
  };

  const addGenre = () => {
    if (newGenre.trim() !== "") {
      setGenres((prevGenres) => [...prevGenres, newGenre]);
      setNewGenre("");
    }
  };

  const deleteGenre = (index: number) => {
    setGenres((prevGenres) => prevGenres.filter((_, i) => i !== index));
  };

  const addOccasion = () => {
    if (occasion.trim() !== "") {
      setOccasions((prevOccasions) => [...prevOccasions, occasion]);
      setOccasion("");
    }
  };

  const deleteOccasion = (index: number) => {
    setOccasions((prevOccasions) =>
      prevOccasions.filter((_, i) => i !== index)
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading DJ data...</Text>
      </View>
    );
  }

  if (!dj) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error loading DJ data. Please try again later.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.container}>
        <SafeAreaView />
        <Text style={styles.heading}>Edit Your Profile...</Text>
        <View>
          {goBackIsVisible && (
            <TouchableOpacity
              style={styles.buttonGoBack}
              onPress={() => router.push("/(tabs)/djprofile")}
            >
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            placeholder={dj.first_name || "Write your first name..."}
            placeholderTextColor={"black"}
            value={updateFirstName}
            onChangeText={setUpdateFirstName}
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Surname</Text>
          <TextInput
            placeholder={dj.surname || "Write your surname..."}
            placeholderTextColor={"black"}
            value={updateSurname}
            onChangeText={setUpdateSurname}
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>City</Text>
          <TextInput
            placeholder={dj.city || "Write your city..."}
            placeholderTextColor={"black"}
            value={updateCity}
            onChangeText={setUpdateCity}
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Genres</Text>
          {genres.map((g, index) => (
            <View key={index} style={styles.container}>
              <Text>{g}</Text>
              <TouchableOpacity onPress={() => deleteGenre(index)}>
                <Text style={styles.messageText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TextInput
            style={styles.input}
            placeholder={`${
              dj.genres && dj.genres.length > 0
                ? dj.genres.join(", ")
                : "Write your genres..."
            }`}
            value={newGenre}
            onChangeText={setNewGenre}
          />
          <TouchableOpacity onPress={addGenre}>
            <Text>Add Genre</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Occasions</Text>
          {occasions.map((o, index) => (
            <View key={index} style={styles.container}>
              <Text>{o}</Text>
              <TouchableOpacity onPress={() => deleteOccasion(index)}>
                <Text style={styles.messageText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TextInput
            style={styles.input}
            placeholder={`${
              dj.occasions && dj.occasions.length > 0
                ? dj.occasions.join(", ")
                : "Write your occasions..."
            }`}
            value={occasion}
            onChangeText={setOccasion}
          />
          <TouchableOpacity onPress={addOccasion}>
            <Text>Add Occasion</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            placeholder={`£${dj.price || "Write your price..."}`}
            placeholderTextColor={"black"}
            value={updatePrice?.toString() || ""}
            onChangeText={(text) => {
              const numericValue = parseFloat(text);
              setUpdatePrice(isNaN(numericValue) ? dj.price : numericValue);
            }}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder={dj.description || "Write your description..."}
            placeholderTextColor={"black"}
            value={updateDescription}
            onChangeText={setUpdateDescription}
            style={[styles.inputMultiline, styles.multilineText]}
            multiline={true}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit All Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditDjProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 30,
  },
  formContainer: {
    flexDirection: "row",
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  input: {
    height: 48,
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
    fontSize: 20,
    borderRadius: 25,
  },
  inputMultiline: {
    height: "auto",
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
    fontSize: 20,
    borderRadius: 25,
  },
  inputContainer: {
    flex: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: 50,
    marginBottom: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonGoBack: {
    height: 47,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 5,
  },
  button: {
    height: 47,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 5,
  },
  buttonPassword: {
    height: 47,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    margin: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  passwordText: {
    fontSize: 20,
  },
  multilineText: {
    minHeight: 100,
  },
  messageText: {
    marginBottom: 5,
    marginTop: 6,
    alignSelf: "center",
  },
});
