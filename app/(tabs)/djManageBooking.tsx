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
import { Timestamp } from "firebase/firestore";

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
            djBookings.map((item) => {
              const bookingDate =
                item.date instanceof Timestamp
                  ? item.date.toDate()
                  : typeof item.date === "string"
                  ? new Date(item.date)
                  : item.date;
              const bookingDateFormatted = bookingDate.toLocaleDateString();
              const bookingTimeFormatted = bookingDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
  
              return (
                <View key={item.id} style={styles.bookingCard}>
                  <Text style={styles.bookingText}>Client: {item.client}</Text>
                  <Text style={styles.bookingText}>Occasion: {item.occasion}</Text>
                  <Text style={styles.bookingText}>
                    Date: {bookingDateFormatted}
                  </Text>
                  <Text style={styles.bookingText}>
                    Time: {bookingTimeFormatted}
                  </Text>
                  <Text style={styles.bookingText}>Location: {item.location}</Text>
                  <Text style={styles.bookingText}>Description: {item.description}</Text>
                  <Text style={styles.statusMessage}>
                    {item.status === "accepted"
                      ? "Booking Accepted"
                      : item.status === "declined"
                      ? "Booking Declined"
                      : "Pending Decision"}
                  </Text>
  
                  {item.status === "pending" && (
                    <View style={styles.buttonContainer}>
                      <Pressable
                        style={styles.button}
                        onPress={() => handleAcceptBooking(item.id)}
                      >
                        <Text style={styles.buttonText}>Accept</Text>
                      </Pressable>
                      <Pressable
                        style={styles.button}
                        onPress={() => handleDenyBooking(item.id)}
                      >
                        <Text style={styles.buttonText}>Decline</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })
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
  bookingText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default DjManageBookings;
