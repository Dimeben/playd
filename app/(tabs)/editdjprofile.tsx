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
import { AuthContext } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { auth } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { setupMicrotasks } from "react-native-reanimated/lib/typescript/reanimated2/threads";

const EditDjProfile = () => {
  const router = useRouter();
  const { userId, username } = useContext(AuthContext);

  const [updateUsername, setUpdateUsername] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");
  const [updateFirstName, setUpdateFirstName] = useState("");
  const [updateSurname, setUpdateSurname] = useState("");
  const [updateCity, setUpdateCity] = useState("");
  const [updateGenre, setUpdateGenre] = useState([]);
  const [updateOccasions, setUpdateOccasions] = useState([]);
  const [updatePrice, setUpdatePrice] = useState();
  const [updateDescription, setUpdateDescription] = useState("");

  const [updateMessage, setUpdateMessage] = useState("");
  const [goBackIsVisible, setGoBackIsVisible] = useState(false);

  const [addGenre, setAddGenre] = useState([]);

  const successMessage = "Sucessfully Updated ";

  const inputRef = useRef();

  //   const usernameRef = useRef("");
  //   const passwordRef = useRef("");
  //   const firstnameRef = useRef("");
  //   const surnameRef = useRef("");
  //   const cityRef = useRef("");
  //   const genreRef = useRef("");
  //   const occasionsRef = useRef("");
  //   const priceRef = useRef("");
  //   const descriptionRef = useRef("");

  const docRef = doc(
    db,
    "djs",
    `${userId != null ? userId : "30ooJWJYBoNFJkCugnOE"}`
  );
  const [dj, setDj] = useState({});
  useEffect(() => {
    const getDjData = () => {
      getDoc(docRef)
        .then((data) => {
          const snapDoc = data.data();
          if (snapDoc) {
            setDj(snapDoc);
          } else console.log("Dj doesn't exist");
        })
        .catch((err) => console.log(err.message));
    };
    getDjData();
  }, [dj]);

  const updatePwd = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setUpdateMessage("Password reset sent to your email!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  const addGenres = () => {
    const data = {
      genres: addGenre,
    };
    docRef
      .add(data)
      .then((prevData) => {
        setAddGenre([{ ...prevData, data }]);
        // release keyboard
        //   Keyboard.dismiss();
        setUpdateMessage(successMessage + "Genres");
        setGoBackIsVisible(true);
        console.log("clicked");
      })
      .catch((err) => {
        Alert.alert(err);
      });
  };

  {
    /*
      const addGenre = () => {
    if (genre && !genres.includes(genre)) {
      setGenres([...genres, genre]);
      setGenre("");
    }
  };
  */
  }

  const addOccasions = () => {};
  //   const updateDJUsername = () => {
  //     const usernameDoc = doc(db, "djs", userId);
  //     updateDoc(usernameDoc, { username: updateUsername }).then(() =>
  //       setUpdateUsernameMessage(successMessage + "Username")
  //     );
  //   };

  const updateDJUsername = async () => {
    try {
      const djDoc = doc(db, "djs", userId);
      await updateDoc(djDoc, { username: updateUsername });
      setUpdateMessage(successMessage + "Username");
      setGoBackIsVisible(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateDJFirstName = async () => {
    try {
      const djDoc = doc(db, "djs", userId);

      await updateDoc(djDoc, { first_name: updateFirstName });
      setUpdateMessage(successMessage + "First Name");
      setGoBackIsVisible(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateDJSurname = async () => {
    try {
      const djDoc = doc(db, "djs", userId);

      await updateDoc(djDoc, { surname: updateSurname });
      setUpdateMessage(successMessage + "Surname");
      setGoBackIsVisible(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateDJCity = async () => {
    try {
      const djDoc = doc(db, "djs", userId);

      await updateDoc(djDoc, { city: updateCity });
      setUpdateMessage(successMessage + "City");
      setGoBackIsVisible(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateDJPrice = async () => {
    try {
      const djDoc = doc(db, "djs", userId);

      await updateDoc(djDoc, { price: updatePrice });
      setUpdateMessage(successMessage + "Price");
      setGoBackIsVisible(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateDJDescription = async () => {
    try {
      const djDoc = doc(db, "djs", userId);

      await updateDoc(djDoc, { description: updateDescription });
      setUpdateMessage(successMessage + "Description");
      setGoBackIsVisible(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <SafeAreaView />
        <Text style={styles.heading}>Edit Your Profile...</Text>
        <View>
          {goBackIsVisible && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.back()}
            >
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text></Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              label="Username"
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
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.buttonPassword} onPress={updatePwd}>
            <Text style={styles.passwordText}>Password Reset Button</Text>
          </TouchableOpacity>
        </View>

        {updateMessage != "" && (
          <Text style={styles.messageText}>
            <SafeAreaView />
            {updateMessage}
          </Text>
        )}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              label="First Name"
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
              label="Surname"
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
            <TextInput
              label="price"
              placeholder={`${
                dj.price === "" ? "Write your price..." : dj.price
              }`}
              placeholderTextColor={"black"}
              value={updatePrice}
              onChangeText={setUpdatePrice}
              style={styles.input}
              underlineColorAndroid="transparent"
              keyboardType="decimal"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={updateDJPrice}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              label="description"
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
  },
  input: {
    height: 48,
    border: 2,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
    fontSize: 20,
  },
  inputMultiline: {
    height: "auto",
    border: 2,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
    fontSize: 20,
  },
  inputContainer: {
    flex: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: 50,
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: "#788eec",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
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
    marginBottom: 10,
  },
});
