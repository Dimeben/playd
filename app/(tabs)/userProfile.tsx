import {
  View,
  Text,
  Pressable,
  Image,
  SafeAreaView,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { doc } from "firebase/firestore";
import { AuthContext } from "../../contexts/AuthContext";
import { getUserById, signOut } from "../../firebase/firestore";
import { Link, useRouter } from "expo-router";
import { User } from "@/firebase/types";
import { LinearGradient } from "expo-linear-gradient";
const Profile = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { isAuthenticated, userId } = useContext(AuthContext);
  const router = useRouter();

  const fetchUser = async () => {
    if (userId) {
      try {
        console.log("profile useEffect - Line 27");
        const userData = await getUserById(userId);
        if (userData) {
          console.log("profile useEffect - Line 30");
          setUser(userData as User);
        } else {
          console.log("profile useEffect - Line 33");
          console.log("User doesn't exist");
        }
      } catch (err) {
        console.log("profile useEffect - Line 37");
        console.error("Error fetching user: ", (err as Error).message);
      }
    }
  };
  console.log("profile useEffect - Line 42");
  useEffect(() => {
    console.log("profile useEffect - Line 23");
    fetchUser();
  }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
    }, [userId])
  );

  const handleLogout = () => {
    signOut()
      .then(() => {
        Alert.alert("You have signed out!");
        router.push("../login");
      })
      .catch((err) => console.log("User didn't sign out"));
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView>
        <Text style={styles.loginMessage}>You must login first</Text>
        <Link href="/login">Login Screen</Link>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4e7ff4", "#97B4FA", "#400691"]}
        style={styles.background}
      >
        <SafeAreaView />
        <Text style={styles.header}>{user?.username}</Text>
        <Image
          style={styles.image}
          source={{
            uri: user?.profile_picture
              ? user.profile_picture
              : "https://firebasestorage.googleapis.com/v0/b/find-my-dj-3a559.appspot.com/o/User-2.webp?alt=media&token=8284f3f1-d2e5-40bf-af04-6d395211d6c8",
          }}
          resizeMode="cover"
        />
        {user && (
          <View style={styles.card}>
            <Pressable>
              <Text>Username: {user.username}</Text>
              <Text>First Name: {user.first_name}</Text>
              <Text>Surname: {user.surname}</Text>
              <Text>City: {user.city}</Text>
            </Pressable>
            <Link style={styles.signupButton} href="/EditUserProfile">
              <Text style={styles.linkText}>Edit Profile</Text>
            </Link>
          </View>
        )}
        <TouchableOpacity style={styles.signupButton} onPress={handleLogout}>
          <Text style={styles.linkText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(userId)}
        >
          <Text style={styles.linkText}>Delete Account</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  image: {
    flex: 1,
    width: "100%",
    maxHeight: 200,
    backgroundColor: "#0553",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    margin: 16,
    height: 180,
    width: "80%",
    ...Platform.select({
      ios: {
        shadowOffset: { width: 2, height: 2 },
        shadowColor: "#333",
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "menlo-bold",
    marginTop: 10,
    marginBottom: 5,
  },
  loginMessage: {
    fontSize: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  button: {
    position: "absolute",
    top: 50,
    left: 10,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonTouch: {
    height: 47,
    borderRadius: 5,
    backgroundColor: "#007AFF",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    margin: 5,
  },
  signupButton: {
    paddingRight: 40,
    paddingLeft: 40,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#007AFF",
    borderRadius: 14,
    borderRightWidth: 1,
    overflow: "hidden",
    margin: 10,
    alignSelf: "center",
    width: "95%",
  },
  deleteButton: {
    paddingRight: 40,
    paddingLeft: 40,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "red",
    borderRadius: 14,
    borderRightWidth: 1,
    overflow: "hidden",
    margin: 10,
    alignSelf: "center",
    width: "95%",
  },
  linkText: {
    color: "#fff",
    fontSize: 18,
    alignSelf: "center",
  },
});
