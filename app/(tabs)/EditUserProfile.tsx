import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
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
  const [updateUsername, setUpdateUsername] = useState("");
  const [updateFirstName, setUpdateFirstName] = useState("");
  const [updateSurname, setUpdateSurname] = useState("");
  const [updateCity, setUpdateCity] = useState("");
  const [goBackIsVisible, setGoBackIsVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const userData = await getUserById(userId);
          if (userData) {
            setUser(userData as User);
            setUpdateUsername(userData.username);
            setUpdateFirstName(userData.first_name);
            setUpdateSurname(userData.surname);
            setUpdateCity(userData.city);
          } else {
            console.log("User doesn't exist");
          }
        } catch (err) {
          console.error("Error fetching user: ", (err as Error).message);
        }
      }
    };
    fetchUser();
  }, [userId]);

  const handleUpdateProfile = async () => {
    try {
      if (userId) {
        const updatedData = {
          username: updateUsername,
          first_name: updateFirstName,
          surname: updateSurname,
          city: updateCity,
        };
        await patchUser(userId, updatedData);
        setGoBackIsVisible(true);
        Alert.alert("Profile successfully updated!");
      } else {
        console.error("userId is null or undefined");
        Alert.alert("Error", "User ID is not available.");
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="black" />
        <Text>Loading user data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.container}>
        <SafeAreaView />
        <Text style={styles.heading}>Edit Your Profile...</Text>

        {goBackIsVisible && (
          <TouchableOpacity
            style={styles.buttonGoBack}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        )}

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
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
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Surname</Text>
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
          </View>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <TextInput
              placeholder={user.city === "" ? "Write your city..." : user.city}
              placeholderTextColor={"black"}
              value={updateCity}
              onChangeText={setUpdateCity}
              style={styles.input}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
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
