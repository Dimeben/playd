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
import { LinearGradient } from "expo-linear-gradient";
import { Timestamp } from "firebase/firestore";

const DjManageBookings = () => {
  const { username } = useContext(AuthContext);
  const [djBookings, setDjBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      if (username) {
        try {
          const fetchedBookings = await getBookingsByDj(username);

          const sortedBookings = fetchedBookings.sort((a, b) => {
            const bookingDateA =
              a.date instanceof Timestamp
                ? a.date.toDate()
                : typeof a.date === "string"
                ? new Date(a.date)
                : a.date;

            const bookingDateB =
              b.date instanceof Timestamp
                ? b.date.toDate()
                : typeof b.date === "string"
                ? new Date(b.date)
                : b.date;

            return bookingDateB.getTime() - bookingDateA.getTime();
          });

          setDjBookings(sortedBookings);
        } catch (error) {
          console.error("Error fetching DJ bookings:", error);
        }
      }
      setLoading(false);
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
    <LinearGradient
      colors={["#C80055", "#A000CC", "#0040CC"]}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeContainer}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.header}>Your Bookings</Text>

            {djBookings.length === 0 ? (
              <Text style={styles.noBookingsMessage}>
                No bookings requested
              </Text>
            ) : (
              djBookings.map((booking) => {
              
                const bookingDate = booking.date instanceof Timestamp
                  ? booking.date.toDate()
                  : new Date(booking.date);

                const bookingDateFormatted = bookingDate.toLocaleDateString();
                const bookingTimeFormatted = bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <View key={booking.id} style={styles.bookingCard}>
                    <Text style={styles.clientDetails}>
                      Client: {booking.client}
                    </Text>
                    <Text style={styles.occasionDetails}>
                      Occasion: {booking.occasion}
                    </Text>
                    <Text style={styles.occasionDetails}>
                      Comments: {booking.comments}
                    </Text>
                    <Text style={styles.locationDetails}>
                      Location: {booking.location}
                    </Text>
                    <Text style={styles.dateDetails}>
                      Date: {bookingDateFormatted}
                    </Text>
                    <Text style={styles.dateDetails}>
                      Time: {bookingTimeFormatted}
                    </Text>
                    <Text
                      style={[
                        styles.statusMessage,
                        booking.status === "accepted"
                          ? styles.accepted
                          : booking.status === "declined"
                          ? styles.declined
                          : styles.pending,
                      ]}
                    >
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
                );
              })
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 15,
  },
  scrollContainer: {
    padding: 16,
  },
  bookingCard: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f2f0f7",
    borderRadius: 12,
    shadowColor: "grey",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  dateDetails: {
    fontSize: 14,
    color: "black",
  },
  clientDetails: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  occasionDetails: {
    fontSize: 14,
    color: "black",
  },
  locationDetails: {
    fontSize: 14,
    color: "black",
  },
  statusMessage: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  noBookingsMessage: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "white",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 16,
    textAlign: "left",
    color: "white",
  },
  gradientBackground: {
    flex: 1,
  },
  accepted: {
    color: "green",
  },
  declined: {
    color: "red",
  },
  pending: {
    color: "blue",
  },
});

export default DjManageBookings;
