import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import {
  getBookingsByDj,
  acceptBooking,
  denyBooking,
} from "../../firebase/firestore";
import { Booking } from "../../firebase/types";
import { SafeAreaView } from "react-native";

const DjManageBookings = () => {
  const { username } = useContext(AuthContext);
  const [djBookings, setDjBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (username) {
        try {
          const bookings = await getBookingsByDj(username);
          setDjBookings(bookings);
          console.log(bookings);
        } catch (error) {
          console.error("Error fetching DJ bookings:", error);
        }
      }
    };
    fetchBookings();
  }, [username]);

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await acceptBooking(bookingId);
      setDjBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "accepted" }
            : booking
        )
      );
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  const handleDenyBooking = async (bookingId: string) => {
    try {
      await denyBooking(bookingId);
      setDjBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "declined" }
            : booking
        )
      );
    } catch (error) {
      console.error("Error denying booking:", error);
    }
  };

    return (
      <SafeAreaView style={styles.safeContainer}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.header}>Your Bookings</Text>
            
            {djBookings.length === 0 ? (
              <Text style={styles.noBookingsMessage}>No bookings requested</Text>
            ) : (
              djBookings.map((booking) => (
                <View key={booking.id} style={styles.bookingCard}>
                  <Text style={styles.details}>Client: {booking.client}</Text>
                  <Text style={styles.details}>Occasion: {booking.occasion}</Text>
                  <Text style={styles.details}>Location: {booking.location}</Text>
                  <Text style={styles.details}>
                    Date: {booking.date?.toDateString()}
                  </Text>
                  <Text style={styles.statusMessage}>
                    {booking.status === "accepted"
                      ? "Booking Accepted"
                      : booking.status === "declined"
                      ? "Booking Declined"
                      : "Pending Decision"}
                  </Text>
    
                  {booking.status === "pending" && (
                    <View style={styles.buttonContainer}>
                      <Pressable
                        style={styles.button}
                        onPress={() => handleAcceptBooking(booking.id)}
                      >
                        <Text style={styles.buttonText}>Accept</Text>
                      </Pressable>
                      <Pressable
                        style={styles.button}
                        onPress={() => handleDenyBooking(booking.id)}
                      >
                        <Text style={styles.buttonText}>Decline</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              ))
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  details: {
    fontSize: 14,
  },
  statusMessage: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noBookingsMessage: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
  header: {
    fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
  marginLeft: 16, 
  textAlign: "left", 
  color: "#333",
  },
});

export default DjManageBookings;
