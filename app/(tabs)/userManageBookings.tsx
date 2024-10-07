import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getBookingsByUser } from "../../firebase/firestore";
import { Booking } from "../../firebase/types";

const UserManageBookings = () => {
  const { username } = useContext(AuthContext);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (username) { 
        try {
          const bookings = await getBookingsByUser(username);
          setUserBookings(bookings);
        } catch (error) {
          console.error("Error fetching user bookings:", error);
        }
      }
    };

    fetchBookings();
  }, [username]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80} // Adjust the offset as needed
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {userBookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <Text style={styles.details}>Event: {booking.occasion}</Text>
            <Text style={styles.details}>Location: {booking.location}</Text>
            <Text style={styles.details}>
              Date: {booking.date instanceof Date ? booking.date.toDateString() : booking.date}
            </Text>
            <Text style={styles.details}>Status: {booking.status}</Text> {/* Show booking status */}
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  bookingCard: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  details: {
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserManageBookings;
