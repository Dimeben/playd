import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import { getBookingByUser } from "../../firebase/firestore";
import { Booking } from "../../firebase/types";

const UserManageBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    console.log("profile useEffect - Line 15") 
    const fetchBookings = async () => {
      console.log("profile useEffect - Line 17") 
      if (currentUser) {
        try {
          console.log("profile useEffect - Line 20") 
          const fetchedBookings = await getBookingByUser(currentUser.uid);
          setBookings(fetchedBookings);
        } catch (error) {
          console.log("profile useEffect - Line 24") 
          console.error("Error fetching bookings:", error);
        } finally {
          console.log("profile useEffect - Line 27") 
          setLoading(false);
        }
      }
    };
    console.log("profile useEffect - Line 32") 
    fetchBookings();
  }, [currentUser]);

  if (loading) {
    return <Text>Loading bookings...</Text>;
  }

  const renderBooking = ({ item }: { item: Booking }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.bookingText}>DJ: {item.dj}</Text>
      <Text style={styles.bookingText}>Event Details: {item.event_details}</Text>
      <Text style={styles.bookingText}>
        Date: {new Date(item.date.seconds * 1000).toLocaleDateString()}
      </Text>
      <Text style={styles.bookingText}>Location: {item.location}</Text>
      <Text style={styles.bookingText}>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {currentUser && (
        <Text style={styles.currentUser}>
          Logged in as: {currentUser.displayName || currentUser.email}
        </Text>
      )}

      <Text style={styles.header}>Your Bookings</Text>

      {bookings.length === 0 ? (
        <Text>No bookings found.</Text>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bookingCard: {
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 10,
  },
  bookingText: {
    fontSize: 16,
    marginBottom: 5,
  },
  currentUser: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 10,
  },
});

export default UserManageBooking;
