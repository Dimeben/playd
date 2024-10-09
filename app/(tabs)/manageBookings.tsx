import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
const manageBookings = () => {
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
        router.push("/djManageBooking");
      } else {
        router.push("/userManageBookings");
      }
    }
  }, [loading, isDj, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={["#C80055", "#A000CC", "#0040CC"]}
          style={styles.backgroundLoading}
        >
          <View style={styles.containerLoading}>
            <ActivityIndicator size="large" color="black" />
            <Text>Loading Bookings...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return null;
};
export default manageBookings;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundLoading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    // flex: 1,
    // height: "100%",
  },
});
