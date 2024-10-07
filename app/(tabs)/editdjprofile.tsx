import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "../../contexts/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import { auth } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { patchDJ, getDJById } from "@/firebase/firestore";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
const EditDjProfile = () => {
  const router = useRouter();
  const { userId, username } = useContext(AuthContext);
  const [updateUsername, setUpdateUsername] = useState("");
  const [updateFirstName, setUpdateFirstName] = useState("");
  const [updateSurname, setUpdateSurname] = useState("");
  const [updateCity, setUpdateCity] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [occasions, setOccasions] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState("");
  const [occasion, setOccasion] = useState("");
  const [updatePrice, setUpdatePrice] = useState();
  const [updateDescription, setUpdateDescription] = useState("");
  const [dj, setDj] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const [goBackIsVisible, setGoBackIsVisible] = useState(false);
  const successMessage = "Successfully Updated ";
  const inputRef = useRef<TextInput>(null);
  useEffect(() => {
    const fetchDjData = async () => {
      if (userId) {
        try {
          console.log("editdjprofile useEffect - Fetching DJ data");
          const djData = await getDJById(userId);
          if (djData) {
            console.log(
              "editdjprofile useEffect - DJ data fetched successfully"
            );
            setDj(djData);
          } else {
            console.log(
              "editdjprofile useEffect - No DJ found for user ID:",
              userId
            );
          }
        } catch (err) {
          console.error(
            "editdjprofile useEffect - Error fetching DJ data:",
            (err as Error).message
          );
        }
      }
    };
    if (userId) {
      fetchDjData();
    } else {
      console.log("editdjprofile useEffect - userId is not available.");
    }
  }, [userId]);
  const updateDJUsername = async () => {
    try {
      if (userId) {
        await patchDJ(userId, { username: updateUsername });
        setGoBackIsVisible(true);
        setUpdateMessage(successMessage + "Username");
      } else {
        console.error("userId is null or undefined");
        Alert.alert("Error", "User ID is not available.");
      }
    } catch (err) {
      console.log((err as Error).message);
    }
  };
  const updateDJFirstName = async () => {
    try {
      if (userId) {
        await patchDJ(userId, { first_name: updateFirstName });
        setGoBackIsVisible(true);
        setUpdateMessage(successMessage + "First Name");
      } else {
        console.error("userId is null or undefined");
        Alert.alert("Error", "User ID is not available.");
      }
    } catch (err) {
      console.log((err as Error).message);
    }
  };
  const updateDJSurname = async () => {
    try {
      if (userId) {
        await patchDJ(userId, { surname: updateSurname });
        setGoBackIsVisible(true);
        setUpdateMessage(successMessage + "Surname");
      } else {
        console.error("userId is null or undefined");
        Alert.alert("Error", "User ID is not available.");
      }
    } catch (err) {
      console.log((err as Error).message);
    }
  };
  const updateDJCity = async () => {
    try {
      if (userId) {
        await patchDJ(userId, { city: updateCity });
        setGoBackIsVisible(true);
        setUpdateMessage(successMessage + "City");
      } else {
        console.error("userId is null or undefined");
        Alert.alert("Error", "User ID is not available.");
      }
    } catch (err) {
      console.log((err as Error).message);
    }
  };
  const updateDJPrice = async () => {
    try {
      if (userId) {
        await patchDJ(userId, { price: updatePrice });
        setGoBackIsVisible(true);
        setUpdateMessage(successMessage + "Price");
      } else {
        console.error("userId is null or undefined");
        Alert.alert("Error", "User ID is not available.");
      }
    } catch (err) {
      console.log((err as Error).message);
    }
  };
  const updateDJDescription = async () => {
    try {
      if (userId) {
        await patchDJ(userId, { description: updateDescription });
        setGoBackIsVisible(true);
        setUpdateMessage(successMessage + "Description");
      } else {
        console.error("userId is null or undefined");
        Alert.alert("Error", "User ID is not available.");
      }
    } catch (err) {
      console.log((err as Error).message);
    }
  };
  const updateOccasions = async () => {
    try {
      if (userId) {
        await patchDJ(userId, { occasions: occasions });
        setGoBackIsVisible(true);
        setUpdateMessage(successMessage + "Occasions");
      } else {
        console.error("userId is null or undefined");
        Alert.alert("Error", "User ID is not available.");
      }
    } catch (err) {
      console.log((err as Error).message);
    }
  };
  const updateGenres = async () => {
    try {
      if (userId) {
        await patchDJ(userId, { genres: genres });
        setGoBackIsVisible(true);
        setUpdateMessage(successMessage + "Genres");
      } else {
        console.error("userId is null or undefined");
        Alert.alert("Error", "User ID is not available.");
      }
    } catch (err) {
      console.log((err as Error).message);
    }
  };
  const addGenre = () => {
    if (newGenre.trim() !== "") {
      setGenres((prevGenres) => [...prevGenres, newGenre]);
      setNewGenre(""); // Clear input after adding
      setUpdateMessage(successMessage + "Genre");
    }
  };
  const deleteGenre = (index: number) => {
    setGenres((prevGenres) => prevGenres.filter((_, i) => i !== index));
  };
  const addOccasion = () => {
    if (occasion.trim() !== "") {
      setOccasions((prevOccasions) => [...prevOccasions, occasion]);
      setOccasion(""); // Clear input after adding
      setUpdateMessage(successMessage + "Occassion");
    }
  };
  const deleteOccasion = (index: number) => {
    setOccasions((prevOccasions) =>
      prevOccasions.filter((_, i) => i !== index)
    );
  };
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.container}>
        <SafeAreaView />
        <Text></Text>
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
      {updateMessage != "" && (
        <Text style={styles.messageText}>
          <SafeAreaView />
          {updateMessage}
        </Text>
      )}
      <Text></Text>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            placeholder={`${
              dj.username === "" ? "Write your username..." : dj.username
            }`}
            placeholderTextColor={"black"}
            value={updateUsername}
            onChangeText={setUpdateUsername}
            style={styles.input}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={updateDJUsername}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.formContainer}>
          <TouchableOpacity style={styles.buttonPassword} onPress={updatePwd}>
            <Text style={styles.passwordText}>Password Reset Button</Text>
          </TouchableOpacity>
        </View> */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={`${
              dj.first_name === "" ? "Write first name..." : dj.first_name
            }`}
            placeholderTextColor={"black"}
            value={updateFirstName}
            onChangeText={setUpdateFirstName}
            style={styles.input}
            underlineColorAndroid="transparent"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={updateDJFirstName}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={`${
              dj.surname === "" ? "Write your surname..." : dj.surname
            }`}
            placeholderTextColor={"black"}
            value={updateSurname}
            onChangeText={(surname) => setUpdateSurname(surname)}
            style={styles.input}
            underlineColorAndroid="transparent"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={updateDJSurname}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            label="city"
            placeholder={`${dj.city === "" ? "Write your city..." : dj.city}`}
            placeholderTextColor={"black"}
            value={updateCity}
            onChangeText={(city) => setUpdateCity(city)}
            style={styles.input}
            underlineColorAndroid="transparent"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={updateDJCity}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      {/* NEED A FUNCTION TO PATCH THE ARRAYS */}
      {/* <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              label="genre"
              placeholder={`${
                dj.genres === "" ? "Write your genres..." : dj.genres
              }`}
              placeholderTextColor={"black"}
              value={updateGenre}
              onChangeText={(genre) => setUpdateGenre(genre)}
              style={styles.input}
              underlineColorAndroid="transparent"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={addGenres}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              label="occasions"
              placeholder={`${
                dj.occasions === "" ? "Write your occasions..." : dj.occasions
              }`}
              placeholderTextColor={"black"}
              value={updateOccasions}
              onChangeText={setUpdateOccasions}
              style={styles.input}
              underlineColorAndroid="transparent"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={addOccasions}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View> */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
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
              dj.genres?.length === 0 ? "Write your genres..." : dj.genres
            }`}
            value={newGenre}
            onChangeText={setNewGenre}
          />
          <Button title="Add Genre" onPress={addGenre} />
        </View>
        <TouchableOpacity style={styles.button} onPress={updateGenres}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
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
              dj.occasions?.length === 0
                ? "Write your occasions..."
                : dj.occasions
            }`}
            value={occasion}
            onChangeText={setOccasion}
          />
          <Button title="Add Occasion" onPress={addOccasion} />
        </View>
        <TouchableOpacity style={styles.button} onPress={updateOccasions}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={`${
              dj.price === 0 ? "Write your price..." : `£${dj.price}`
            }`}
            placeholderTextColor={"black"}
            value={updatePrice?.toString() || ""}
            onChangeText={(text) => {
              const numericValue = parseFloat(text);
              if (!isNaN(numericValue)) {
                setUpdatePrice(numericValue);
              } else {
                setUpdatePrice(dj.price);
              }
            }}
            style={styles.input}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={updateDJPrice}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={`${
              dj.description === ""
                ? "Write your description..."
                : dj.description
            }`}
            placeholderTextColor={"black"}
            value={updateDescription}
            onChangeText={setUpdateDescription}
            style={[styles.inputMultiline, styles.multilineText]}
            underlineColorAndroid="transparent"
            multiline={true}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={updateDJDescription}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
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
    // height: 80,
    marginLeft: 10,
    marginRight: 10,
    // marginTop: 100,
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
