import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
const profile = () => {
  const [isDj, setIsDj] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const router = useRouter();
  const navigation = useNavigation();

  const checkIfDj = async () => {
    setLoading(true);
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const djDocRef = doc(db, "djs", userId);
      const djDocSnapshot = await getDoc(djDocRef);

      if (djDocSnapshot.exists()) {
        setIsDj(true);
      } else {
        setIsDj(false);
      }
    } else {
      setIsDj(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkIfDj();
    const unsubscribe = navigation.addListener("focus", () => {
      checkIfDj();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!loading) {
      if (isDj) {
        router.push("/djprofile");
      } else {
        router.push("/userProfile");
      }
    }
  }, [loading, isDj, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={["#00005B", "#A000CC", "#0040CC"]}
          style={styles.background}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.white}>Loading Profile...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    // flex: 1,
    // height: "100%",
  },
  white: {
    color: "white",
  },
});
export default profile;
