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
import { getDJById, signOut } from "../../firebase/firestore";
import FeedbackForSingleDj from "../../components/FeedbackForSingleDj";
import { AuthContext } from "@/contexts/AuthContext";
import { DJ } from "@/firebase/types";
import { WebView } from "react-native-webview";

const DjProfilePage = () => {
  const { isAuthenticated, userId, username } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [dj, setDj] = useState<DJ | null>(null);
  const [isDjLoggedIn, setIsDjLoggedIn] = useState(false);
  const [soundcloudName, setSoundcloudName] = useState("chaunconscious");

  const iframeString = `${`<iframe
    allowtransparency="true"
    scrolling="no"
    frameborder="no"
    src="https://w.soundcloud.com/icon/?url=http%3A%2F%2Fsoundcloud.com%2F${soundcloudName}&color=orange_white&size=32"
    style="width: 32px; height: 32px;"
  ></iframe>`}`;

  useEffect(() => {
    console.log("djprofile useEffect - Line 41")
    const fetchDjData = async () => {
      setIsLoading(true);
      if (!userId) {
        console.log("djprofile useEffect - Line 45")
        console.log("User ID is null");
        setIsLoading(false);
        return;
      }

      try {
        console.log("djprofile useEffect - Line 52")
        const djData = await getDJById(userId);
        if (djData) {
          console.log("djprofile useEffect - Line 55")
          setDj(djData as DJ);
        } else {
          console.log("djprofile useEffect - Line 58")
          console.log("DJ not found");
        }
      } catch (error) {
        console.log("djprofile useEffect - Line 62")
        console.error("Error fetching DJ data:", (error as Error).message);
        Alert.alert("Error", "Unable to fetch DJ data. Please try again.");
      } finally {
        console.log("djprofile useEffect - Line 66")
        setIsLoading(false);
      }
    };
    console.log("djprofile useEffect - Line 70")
    fetchDjData();
  }, [userId]);

  const handleLogout = () => {
    signOut()
      .then(() => {
        Alert.alert("You have signed out!");
      })
      .catch((err) => console.log("User didn't sign out"));
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
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorMessage}>DJ profile not found</Text>
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

      <View style={styles.formContainer}>
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
      </View>

      {iframeString && (
        <WebView
          source={{ html: iframeString }}
          style={{ marginTop: 20, height: 300 }}
        />
      )}

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

          <TouchableOpacity style={styles.buttonTouch} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
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
  formContainer: {
    flexDirection: "row",
    marginLeft: 10,
    marginRight: 10,
  },
  image: {
    width: "100%",
    minHeight: 150,
    maxHeight: 150,
    backgroundColor: "#eaeaea",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    margin: 16,
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
  button: {
    padding: 10,
    backgroundColor: "#007AFF",
    width: "80%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessage: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginVertical: 20,
  },
  inputContainer: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
  },
});
