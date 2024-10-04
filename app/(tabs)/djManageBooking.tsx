import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import { getBookingByDj, updateBookingStatus } from "../../firebase/firestore";
import { Booking } from "../../firebase/types";

const DjManageBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    console.log("djManageBooking useEffect - Line 15")
    const getDjBookings = async () => {
      if (currentUser) {
        console.log("djManageBooking useEffect - Line 18")
        try {
          console.log("djManageBooking useEffect - Line 20")
          const fetchedBookings = await getBookingByDj(currentUser.uid);
          setBookings(fetchedBookings);
        } catch (error) {
          console.log("djManageBooking useEffect - Line 24")
          console.error("Error fetching bookings:", error);
        } finally {
          console.log("djManageBooking useEffect - Line 27")
          setLoading(false);
        }
      }
    };
    console.log("djManageBooking useEffect - Line 32")

    getDjBookings();
  }, [currentUser]);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

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

      {/* Show action buttons if the status is pending */}
      {item.status === "pending" && (
        <View style={styles.buttonContainer}>
          <Button
            title="Accept"
            onPress={() => handleStatusUpdate(item.id, "accepted")}
          />
          <Button
            title="Decline"
            onPress={() => handleStatusUpdate(item.id, "declined")}
          />
        </View>
      )}
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default DjManageBooking;
