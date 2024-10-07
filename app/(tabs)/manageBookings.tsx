import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

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
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  return null;
};
export default manageBookings;
