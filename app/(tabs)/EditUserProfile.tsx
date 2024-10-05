import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getUserById, patchUser } from "../../firebase/firestore";
import { useRouter } from "expo-router";
import { User } from "@/firebase/types";
const EditUserProfile = () => {
  const router = useRouter();
  const { userId } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [updateUsername, setUpdateUsername] = useState("");
  const [updateFirstName, setUpdateFirstName] = useState("");
  const [updateSurname, setUpdateSurname] = useState("");
  const [updateCity, setUpdateCity] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [goBackIsVisible, setGoBackIsVisible] = useState(false);
  const successMessage = "Successfully Updated ";
  const inputRef = useRef<TextInput>(null);
  useEffect(() => {
    console.log("EditUserProfile useEffect - Line 25");
    const fetchUser = async () => {
      if (userId) {
        console.log("EditUserProfile useEffect - Line 28");
        try {
          const userData = await getUserById(userId);
          console.log("EditUserProfile useEffect - Line 31");
          if (userData) {
            setUser(userData as User);
            setUsername(userData.username);
            setFirstName(userData.first_name);
            setSurname(userData.surname);
            setCity(userData.city);
            console.log("EditUserProfile useEffect - Line 38");
          } else {
            console.log("EditUserProfile useEffect - Line 40");
            console.log("User doesn't exist");
          }
        } catch (err) {
          console.log("EditUserProfile useEffect - Line 44");
          console.error("Error fetching user: ", (err as Error).message);
        }
      }
    };
    console.log("EditUserProfile useEffect - Line 49");
    fetchUser();
  }, [userId]);

  const handleUpdateFirstName = async () => {
    try {
      if (userId) {
        await patchUser(userId, { first_name: updateFirstName });
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

  const handleUpdateSurname = async () => {
    try {
      if (userId) {
        await patchUser(userId, { surname: updateSurname });
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

  const handleUpdateCity = async () => {
    try {
      if (userId) {
        await patchUser(userId, { city: updateCity });
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

  const handleUpdateUsername = async () => {
    try {
      if (userId) {
        await patchUser(userId, { username: updateUsername });
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

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading user data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <SafeAreaView />
        <Text style={styles.heading}>Edit Your Profile...</Text>

        {goBackIsVisible && (
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        )}

        <View style={styles.container}>
          <Text style={styles.input}>Username</Text>
          <TextInput
            ref={inputRef}
            placeholder={
              user.username === "" ? "Write your username..." : user.username
            }
            placeholderTextColor={"black"}
            value={updateUsername}
            onChangeText={setUpdateUsername}
            style={styles.input}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdateUsername}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        {updateMessage !== "" && (
          <Text style={styles.messageText}>{updateMessage}</Text>
        )}

        <View style={styles.container}>
          <TextInput
            placeholder={
              user.first_name === "" ? "Write first name..." : user.first_name
            }
            placeholderTextColor={"black"}
            value={updateFirstName}
            onChangeText={setUpdateFirstName}
            style={styles.input}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdateFirstName}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.container}>
          <TextInput
            placeholder={
              user.surname === "" ? "Write your surname..." : user.surname
            }
            placeholderTextColor={"black"}
            value={updateSurname}
            onChangeText={setUpdateSurname}
            style={styles.input}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity style={styles.button} onPress={handleUpdateSurname}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <TextInput
            placeholder={user.city === "" ? "Write your city..." : user.city}
            placeholderTextColor={"black"}
            value={updateCity}
            onChangeText={setUpdateCity}
            style={styles.input}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity style={styles.button} onPress={handleUpdateCity}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditUserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: "#007AFF",
  },
  messageText: {
    marginBottom: 10,
  },
});

{
  /* <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Surname"
          value={surname}
          onChangeText={setSurname}
          style={styles.input}
        />
        <TextInput
          placeholder="City"
          value={city}
          onChangeText={setCity}
          style={styles.input}
        />
      </View>
      <Pressable style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </Pressable>
      <Link style={styles.link} href="/(tabs)/profile">
        <Text style={styles.linkText}>Go Back to Profile</Text>
      </Link>
    </SafeAreaView> */
}
