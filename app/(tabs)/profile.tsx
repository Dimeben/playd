import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { Link, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "@/contexts/AuthContext";
import { getAuth } from "firebase/auth";

const profile = () => {
  const { isAuthenticated, userId, username } = useContext(AuthContext);

  if (isAuthenticated) {
    const docRef = doc(
      db,
      "users",
      `${userId != null ? userId : "7uwu0DlglTH6bxSfFZdJ"}`
    );
    const [user, setUser] = useState({});
    useEffect(() => {
      const getUserData = () => {
        getDoc(docRef)
          .then((data) => {
            const snapDoc = data.data();
            if (snapDoc) {
              setUser(snapDoc);
            } else console.log("User doesn't exist");
          })
          .catch((err) => console.log(err.message));
      };
      getUserData();
    }, [userId]);

    return (
      <View style={styles.container}>
        <SafeAreaView />
        <Text style={styles.heading}>{user.username}</Text>
        <Image
          style={styles.image}
          source={{
            uri:
              user.profile_picture != null
                ? user.profile_picture
                : "https://firebasestorage.googleapis.com/v0/b/find-my-dj-3a559.appspot.com/o/User-2.webp?alt=media&token=8284f3f1-d2e5-40bf-af04-6d395211d6c8",
          }}
          contentFit="cover"
        />
        <View style={styles.card}>
          <Pressable>
            <Text>Username: {user.username}</Text>
            <Text>First Name: {user.first_name}</Text>
            <Text>Surname: {user.surname}</Text>
            <Text>City: {user.city}</Text>
          </Pressable>
        </View>
      </View>
    );
  } else
    return (
      <SafeAreaView>
        <Text style={styles.loginMessage}>You must login first</Text>
        <Link href="/(tabs)/login">Login Screen</Link>
      </SafeAreaView>
    );
};

export default profile;

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
