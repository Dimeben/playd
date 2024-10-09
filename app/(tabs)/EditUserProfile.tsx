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
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";

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
            setGoBackIsVisible(true);
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
        router.push("/(tabs)/profile");
        Alert.alert("Profile successfully updated!");
      } else {
        console.error("userId is null or undefined");
        Alert.alert("Error", "User ID is not available.");
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  const clearForm = async () => {
    const userData = await getUserById(userId!);
    if (userData) {
      setUpdateFirstName(userData.first_name);
      setUpdateSurname(userData.surname);
      setUpdateCity(userData.city);
    }
  };

  const handleGoBack = () => {
    clearForm();
    router.push("/(tabs)/profile");
  };

  useFocusEffect(
    React.useCallback(() => {
      clearForm();
    }, [userId])
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={["#C80055", "#A000CC", "#0040CC"]}
          style={styles.backgroundLoading}
        >
          <View style={styles.container}>
            <ActivityIndicator size="large" color="black" />
            <Text>Loading profile...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={["#C80055", "#A000CC", "#0040CC"]}
      style={styles.background}
    >
      <ScrollView>
        <View style={styles.container}>
          <SafeAreaView />
          <Text style={styles.header}>Edit Your Profile</Text>

          {goBackIsVisible && (
            <TouchableOpacity
              style={styles.buttonGoBack}
              onPress={handleGoBack}
            >
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          )}

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                placeholder={
                  user.first_name === ""
                    ? "Write first name..."
                    : user.first_name
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
                placeholder={
                  user.city === "" ? "Write your city..." : user.city
                }
                placeholderTextColor={"black"}
                value={updateCity}
                onChangeText={setUpdateCity}
                style={styles.input}
                underlineColorAndroid="transparent"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleUpdateProfile}
          >
            <Text style={styles.linkText}>Submit All Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default EditUserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "GeezaPro-Bold",
    marginTop: 14,
    marginBottom: 15,
  },
  background: {
    flex: 1,
      },
  backgroundLoading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    // flex: 1,
    // height: "100%",
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
    borderRadius: 12,
  },
  inputMultiline: {
    height: "auto",
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
    fontSize: 20,
    borderRadius: 12,
  },
  inputContainer: {
    flex: 1,

    width: 50,
    marginBottom: 5,
    overflow: "hidden",
  },
  buttonGoBack: {

    borderRadius: 25,
    backgroundColor: "#1c93ed",
    borderWidth: 1,
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
    borderRadius: 12,
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
  signupButton: {
    paddingRight: 40,
    paddingLeft: 40,
    paddingTop: 9,
    paddingBottom: 9,
    borderWidth: 1,
    backgroundColor: "#1c93ed",
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
});
