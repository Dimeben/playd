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
  TextInput,
} from "react-native";
import { Link } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { getDjById, signOut } from "../../firebase/firestore";
import FeedbackForSingleDj from "../../components/FeedbackForSingleDj";
import { AuthContext } from "../../contexts/AuthContext";
import { DJ } from "../../firebase/types";
import { WebView } from "react-native-webview";
import SoundCloud from "@/components/SoundCloud";
import { deleteDJ } from "../../firebase/firestore";
const DjProfilePage = () => {
  const { isAuthenticated, userId, username } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [dj, setDj] = useState<DJ | null>(null);
  const [soundcloudName, setSoundcloudName] = useState("multunes");

  useEffect(() => {
    console.log("djprofile useEffect - Line 41");
    const fetchDjData = async () => {
      setIsLoading(true);
      if (!userId) {
        console.log("djprofile useEffect - Line 45");
        console.log("User ID is null");
        setIsLoading(false);
        return;
      }

      try {
        const djData = await getDjById(userId);
        if (djData) {
          setDj(djData as DJ);
        } else {
          console.log("DJ not found");
        }
      } catch (error) {
        console.error("Error fetching DJ data:", (error as Error).message);
        Alert.alert("Error", "Unable to fetch DJ data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDjData();
  }, [userId]);

  const handleLogout = () => {
    signOut()
      .then(() => {
        Alert.alert("You have signed out!");
      })
      .catch((err) => console.log("User didn't sign out"));
  };

  const handleDelete = (userId) => {
    deleteDJ(userId);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!dj) {
    return (
      // <SafeAreaView style={styles.loadingContainer}>
      //   <Text style={styles.errorMessage}>DJ profile not found</Text>
      // </SafeAreaView>
      <SafeAreaView>
        <Text style={styles.loginMessage}>You must login first!</Text>
        <Text></Text>
        <Link style={styles.button} href="/(tabs)/login">
          <Text style={styles.buttonText}>Login Screen</Text>
        </Link>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView />
      <Image
        style={styles.image}
        source={{
          uri:
            dj.profile_picture ??
            "https://www.shutterstock.com/image-photo/zhangjiajie-national-forest-park-unesco-260nw-2402891639.jpg",
        }}
      />

      {/* <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={`Input Your SoundCloud Name`}
            placeholderTextColor={"black"}
            value={soundcloudName}
            onChangeText={setSoundcloudName}
            style={styles.input}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
      </View> */}

      {/* {iframeString && <SoundCloud />} */}

      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.heading}>{dj.username}</Text>
          <View style={styles.card}>
            <Pressable>
              <Text>Username: {dj.username}</Text>
              <Text>First Name: {dj.first_name}</Text>
              <Text>Surname: {dj.surname}</Text>
              <Text>City: {dj.city}</Text>
              <Text>Genres: {dj.genres}</Text>
              {/* {console.log(typeof dj.genres)} */}
              <Text>
                Occasions:
                {dj.occasions.length > 1
                  ? dj.occasions.join(", ")
                  : dj.occasions}
              </Text>
              <Text>Price: {dj.price}</Text>
              <Text>Rating: {dj.rating}</Text>
              <Text>Description: {dj.description}</Text>
            </Pressable>
          </View>

          <Link
            style={styles.button}
            href={{
              pathname: "/(tabs)/editdjprofile",
              // /* 1. Navigate to the details route with query params */
              params: { dj: dj },
            }}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </Link>

          <View style={styles.card}>
            <Text style={styles.heading}>Feedback</Text>
            <FeedbackForSingleDj dj={dj} />
          </View>

          <TouchableOpacity style={styles.buttonTouch} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonTouch}
            onPress={() => handleDelete(userId)}
          >
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
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
