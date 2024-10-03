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
import { getDjById, signOut } from "../../firebase/firestore";
import FeedbackForSingleDj from "../../components/FeedbackForSingleDj";
import { AuthContext } from "@/contexts/AuthContext";
import { DJ } from "@/firebase/types";

const DjProfilePage = () => {
  const { isAuthenticated, userId, username } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [dj, setDj] = useState<DJ | null>(null);

  useEffect(() => {
    const fetchDjData = async () => {
      setIsLoading(true);

      if (!userId) {
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
          uri: dj?.profile_picture ?? "https://www.shutterstock.com/image-photo/zhangjiajie-national-forest-park-unesco-260nw-2402891639.jpg",
        }}
      />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.heading}>{dj?.username}</Text>

          <View style={styles.card}>
            <Text>Username: {dj?.username}</Text>
            <Text>First Name: {dj?.first_name}</Text>
            <Text>Surname: {dj?.surname}</Text>
            <Text>City: {dj?.city}</Text>
            <Text>Genres: {dj?.genres?.join(", ")}</Text>
            <Text>Occasions: {dj?.occasions?.join(", ")}</Text>
            <Text>Price: {dj?.price}</Text>
            <Text>Rating: {dj?.rating}</Text>
            <Text>Description: {dj?.description}</Text>
          </View>
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
});
