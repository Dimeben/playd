import {
  View,
  Text,
  Pressable,
  Image,
  SafeAreaView,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { doc } from "firebase/firestore";
import { AuthContext } from "../../contexts/AuthContext";
import { getUserById } from "@/firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Link } from "expo-router";
import { User } from "@/firebase/types";

const Profile = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { isAuthenticated, userId } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const userData = await getUserById(userId);
          if (userData) {
            setUser(userData as User);
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

  if (!isAuthenticated) {
    return (
      <SafeAreaView>
        <Text style={styles.loginMessage}>You must login first</Text>
        <Link href="/(tabs)/login">Login Screen</Link>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Text style={styles.heading}>{user?.username}</Text>
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
          <Link style={styles.button} href="/(tabs)/EditUserProfile">
            <Text style={styles.buttonText}>Edit Profile</Text>
          </Link>
        </View>
      )}
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
  heading: {
    fontSize: 30,
  },
  loginMessage: {
    fontSize: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
});
