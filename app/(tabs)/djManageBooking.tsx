import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
    ScrollView,
  StyleSheet,
  ActivityIndicator,
    Button, Pressable,
} from "react-native";
import { getAuth } from "firebase/auth";
        import { AuthContext } from "../../contexts/AuthContext";
import { getBookingsByDj, updateBooking, acceptBooking, denyBooking } from "../../firebase/firestore";
import { Booking } from "../../firebase/types";

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
    console.log("djManageBooking useEffect - Line 15");
<!--     const getDjBookings = async () => {
      if (currentUser) {
        console.log("djManageBooking useEffect - Line 18");
        try {
          console.log("djManageBooking useEffect - Line 20");
          const fetchedBookings = await getBookingsByDj(currentUser.uid);
          setBookings(fetchedBookings);
        } catch (error) {
          console.log("djManageBooking useEffect - Line 24");
          console.error("Error fetching bookings:", error);
        } finally {
          console.log("djManageBooking useEffect - Line 27");
          setLoading(false);
        }
      }
    };
    console.log("djManageBooking useEffect - Line 32"); -->

    fetchBookings();
  }, [username]);

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await acceptBooking(bookingId);
      setDjBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? { ...booking, status: "accepted" } : booking
        )
      );
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  const handleDenyBooking = async (bookingId: string) => {
    try {
      await denyBooking(bookingId);
      setDjBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? { ...booking, status: "declined" } : booking
        )
      );
    } catch (error) {
      console.error("Error denying booking:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {djBookings.map((booking) => (
        <View key={booking.id} style={styles.bookingCard}>
          <Text style={styles.details}>Client: {booking.client}</Text>
          <Text style={styles.details}>Occasion: {booking.occasion}</Text>
          <Text style={styles.details}>Location: {booking.location}</Text>
          <Text style={styles.details}>Date: {booking.date?.toDateString()}</Text>

          <Text style={styles.statusMessage}>
            {booking.status === "accepted"
              ? "Booking Accepted"
              : booking.status === "declined"
              ? "Booking Declined"
              : "Pending Decision"}
          </Text>

          {booking.status === "pending" && (
            <View style={styles.buttonContainer}>
              <Pressable style={styles.button} onPress={() => handleAcceptBooking(booking.id)}>
                <Text style={styles.buttonText}>Accept</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => handleDenyBooking(booking.id)}>
                <Text style={styles.buttonText}>Decline</Text>
              </Pressable>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
    borderColor: '#ddd',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  }
});


export default DjManageBookings;
