import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
  Linking,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import { Link, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import FeedbackForSingleDj from "../../components/FeedbackForSingleDj";
import { AuthContext } from "@/contexts/AuthContext";
import { getAuth, signOut } from "firebase/auth";

const DjProfilePage = () => {
  // const user = useNavigationState((state) => {
  //   console.log(state.routes[state.index]);
  // });
  const { isAuthenticated, userId, username } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isDjLoggedIn, setIsDjLoggedIn] = useState(false);
  // const docRef = doc(
  //   db,
  //   "djs",
  //   `${
  //     auth?.currentUser !== null
  //       ? auth?.currentUser.uid
  //       : "30ooJWJYBoNFJkCugnOE"
  //   }`
  // );
  const handleLogout = () => {
    signOut(auth)
      .then((response) => {
        Alert.alert("You have signed out!");
      })
      .catch((err) => console.log("User didn't sign out"));
  };

  if (isDjLoggedIn) {
    // {
    //   /* ISAUTHENTICATED AND ISDJACCOUNT NOT WORKING WITH LOGOUT BUTTON */
    // }
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
      setIsLoading(false);
      setIsDjLoggedIn(true);
    }, [dj]);
    if (isLoading) {
      return (
        <Text style={styles.heading}>
          <SafeAreaView />
          <ActivityIndicator size="large" color="black" animating={true} />
          Loading...
        </Text>
      );
    } else
      return (
        <>
          <SafeAreaView />

          <Image
            style={styles.image}
            source={{
              uri:
                dj.profile_picture != null
                  ? dj.profile_picture
                  : "https://www.shutterstock.com/image-photo/zhangjiajie-national-forest-park-unesco-260nw-2402891639.jpg",
            }}
            contentFit="cover"
          />
          <ScrollView>
            <View style={styles.container}>
              <Text style={styles.heading}>{dj.username}</Text>

              <View style={styles.card}>
                <Pressable>
                  <Text>Username: {dj.username}</Text>
                  <Text>First Name: {dj.first_name}</Text>
                  <Text>Surname: {dj.surname}</Text>
                  <Text>City: {dj.city}</Text>
                  <Text>Genre:{dj.genres}</Text>
                  <Text>Occasions: {dj.occasions}</Text>
                  <Text>Price: {dj.price}</Text>
                  <Text>Rating: {dj.rating}</Text>
                  <Text>Description: {dj.description}</Text>
                </Pressable>
              </View>

              <Link style={styles.button} href="/(tabs)/editdjprofile">
                <Text style={styles.buttonText}>Edit Profile</Text>
              </Link>

              <View style={styles.card}>
                <Text style={styles.heading}>Feedback</Text>
                <FeedbackForSingleDj dj={dj} />
              </View>
              <TouchableOpacity
                style={styles.buttonTouch}
                onPress={handleLogout}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </>
      );
  } else
    return (
      <SafeAreaView>
        <Text style={styles.loginMessage}>You must login first!</Text>
        <Text></Text>
        <Link style={styles.button} href="/(tabs)/login">
          <Text style={styles.buttonText}>Login Screen</Text>
        </Link>
      </SafeAreaView>
    );
};

export default DjProfilePage;

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
    minHeight: 150,
    maxHeight: 150,
    backgroundColor: "#0553",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    margin: 16,
    height: "auto",
    width: 320,
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
    marginTop: 10,
  },
  loginMessage: {
    fontSize: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginRight: "auto",
    marginLeft: "auto",
  },
  button: {
    padding: 10,
    backgroundColor: "#007AFF",
    width: "80%",
    alignItems: "center",
    marginRight: "auto",
    marginLeft: "auto",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    // paddingTop: 50,
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
});
