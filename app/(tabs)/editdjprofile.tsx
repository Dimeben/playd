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
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";

import { useFocusEffect } from "@react-navigation/native";
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
            setGoBackIsVisible(true);
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
        router.push("/(tabs)/djprofile");
        Alert.alert("Profile successfully updated!");
      } else {
        Alert.alert("Error", "User ID is not available.");
      }
    } catch (err) {
      console.log("Error updating profile:", err);
    }
  };

  const clearForm = async () => {
    const djData = await getDJById(userId!);
    if (djData) {
      setDj(djData);
      setGenres(djData.genres || []);
      setOccasions(djData.occasions || []);
      setUpdateFirstName(djData.first_name || "");
      setUpdateSurname(djData.surname || "");
      setUpdateCity(djData.city || "");
      setUpdatePrice(djData.price);
      setUpdateDescription(djData.description || "");
      setGoBackIsVisible(true);
    }
  };

  const handleGoBack = () => {
    clearForm();
    router.push("/(tabs)/djprofile");
  };

  useFocusEffect(
    React.useCallback(() => {
      clearForm();
    }, [userId])
  );

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
        <LinearGradient
          colors={["#C80055", "#A000CC", "#0040CC"]}
          style={styles.backgroundLoading}
        >
          <Text>Loading DJ data...</Text>
        </LinearGradient>
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
      <LinearGradient
        colors={["#C80055", "#A000CC", "#0040CC"]}
        style={styles.background}
      >
        <View style={styles.container}>
          <SafeAreaView />
          <Text style={styles.header}>Edit Your Profile</Text>
          <View>
            {goBackIsVisible && (
              <TouchableOpacity
                style={styles.buttonGoBack}
                onPress={handleGoBack}
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
            <View style={styles.row}>
              {genres.map((g, index) => (
                <View key={index}>
                  <Text style={styles.white}>{g} </Text>
                  <TouchableOpacity
                    onPress={() => deleteGenre(index)}
                    style={styles.smallButton}
                  >
                    <Text style={styles.linkText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
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
            <TouchableOpacity onPress={addGenre} style={styles.signupButton}>
              <Text style={styles.linkText}>Add Genre</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Occasions</Text>
            <View style={styles.row}>
              {occasions.map((o, index) => (
                <View key={index}>
                  <Text style={styles.white}>{o}</Text>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => deleteOccasion(index)}
                  >
                    <Text style={styles.linkText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
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
            <TouchableOpacity onPress={addOccasion} style={styles.signupButton}>
              <Text style={styles.linkText}>Add Occasion</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price Per Hour</Text>
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

        <TouchableOpacity style={styles.signupButton} onPress={handleSubmit}>
          <Text style={styles.linkText}>Submit All Changes</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

export default EditDjProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  backgroundLoading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "GeezaPro-Bold",
    marginTop: 14,
    marginBottom: 15,
  },
  formContainer: {
    flexDirection: "row",
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: "white",
    borderRadius: 5,
  },
  inputMultiline: {
    height: "auto",
    overflow: "hidden",
    borderColor: "gray",

    backgroundColor: "white",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
    fontSize: 20,
    borderRadius: 5,
  },
  inputContainer: {
    flex: 1,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    width: 50,
    marginBottom: 5,
    overflow: "hidden",
  },
  buttonGoBack: {
    borderRadius: 14,
    backgroundColor: "#005bbd",
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 9,
    paddingBottom: 9,
    margin: 5,
  },
  button: {
    height: 47,
    borderRadius: 14,
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
  smallButton: {
    backgroundColor: "red",
    borderRadius: 14,
    borderRightWidth: 1,
    overflow: "hidden",
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 6,
    paddingBottom: 6,
    margin: 2,
    marginLeft: 5,
    marginBottom: 5,
    alignSelf: "center",
  },
  signupButton: {
    paddingRight: 40,
    paddingLeft: 40,
    paddingTop: 9,
    paddingBottom: 9,
    backgroundColor: "#005bbd",
    borderRadius: 14,
    borderRightWidth: 1,
    overflow: "hidden",
    margin: 10,
    marginBottom: 30,
    marginTop: 20,
    alignSelf: "center",
    width: "85%",
  },
  linkText: {
    color: "#fff",
    fontSize: 18,
    alignSelf: "center",
  },
  label: {
    color: "white",
    marginBottom: 2,
    fontWeight: "bold",
  },
  white: {
    color: "white",
    marginLeft: 19,
  },
});
