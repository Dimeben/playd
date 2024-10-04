import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
    SafeAreaView,
  } from "react-native";
  import React, { useContext, useEffect, useState } from "react";
  import { AuthContext } from "../../contexts/AuthContext";
  import { getUserById, updateUser } from "@/firebase/firestore";
  import { User } from "@/firebase/types";
  import { Link } from "expo-router";
  
  const EditUserProfile = () => {
    const { userId } = useContext(AuthContext);
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [city, setCity] = useState<string>("");
  
    useEffect(() => {
      const fetchUser = async () => {
        if (userId) {
          try {
            const userData = await getUserById(userId);
            if (userData) {
              setUser(userData as User);
              setUsername(userData.username);
              setFirstName(userData.first_name);
              setSurname(userData.surname);
              setCity(userData.city);
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
      if (userId) {
        try {
          await updateUser(userId, {
            username,
            first_name: firstName,
            surname,
            city,
          });
          Alert.alert("Profile updated successfully!");
        } catch (error) {
          console.error("Error updating profile: ", (error as Error).message);
          Alert.alert("Error", "Could not update profile. Please try again.");
        }
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
      <SafeAreaView style={styles.container}>
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
      </SafeAreaView>
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
  });
  