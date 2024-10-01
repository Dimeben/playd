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
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import FeedbackForSingleDj from "../../components/FeedbackForSingleDj";
import { getAuth } from "firebase/auth";

const DjProfilePage = () => {
  const params = useLocalSearchParams();
  const auth = getAuth();
  const docRef = doc(
    db,
    "djs",
    `${
      auth.currentUser !== null ? auth.currentUser.uid : "30ooJWJYBoNFJkCugnOE"
    }`
  );
  const [dj, setDj] = useState({});
  useEffect(() => {
    const getDjData = () => {
      getDoc(docRef).then((data) => {
        const snapDoc = data.data();
        if (snapDoc) {
          setDj(snapDoc);
        } else console.log("Doesnt exist");
      });
    };
    getDjData();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Text style={styles.heading}>{dj.username}</Text>
      <Image
        style={styles.image}
        source={{ uri: dj.profile_picture }}
        contentFit="cover"
      />
      <View style={styles.card}>
        <Pressable>
          <Text>Username: {dj.username}</Text>
          <Text>First Name: {dj.first_name}</Text>
          <Text>Surname: {dj.surname}</Text>
          <Text>City: {dj.city}</Text>
          <Text>Genre: {dj.genre}</Text>
          <Text>Occasions: {dj.occasion}</Text>
          <Text>Price: {dj.price}</Text>
          <Text>Description: {dj.description}</Text>
        </Pressable>
      </View>
      <View style={styles.card}>
        <Text style={styles.heading}>Feedback</Text>
        <FeedbackForSingleDj dj={dj} />
      </View>
    </View>
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
    fontSize: "30%",
  },
});
