import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import { getAuth } from "firebase/auth";
import { AuthContext } from "../../contexts/AuthContext";
import { postFeedback, getBookingByUser } from "../../firebase/firestore";
import { Booking, Feedback } from "../../firebase/types";

const UserManageBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({
    title: "",
    body: "",
    stars: 0,
    dj: "",
    date: new Date(),
  } as Partial<Feedback>);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { userId, username } = useContext(AuthContext);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  console.log(selectedBooking);

  useEffect(() => {
    const fetchBookings = async () => {
      if (username) {
        try {
          const fetchedBookings = await getBookingByUser(
            username.toLowerCase()
          );
          setBookings(fetchedBookings);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBookings();
  }, [username]);

  const handlePostFeedback = async () => {
    if (selectedBooking) {
      try {
        const feedbackData: Feedback = {
          author:
            username || currentUser?.email || currentUser?.uid || "Anonymous",
          title: feedback.title?.trim() || "",
          body: feedback.body?.trim() || "",
          stars: feedback.stars || 0,
          dj: selectedBooking.dj,
          date: new Date(),
        };

        console.log("Submitting feedback: ", feedbackData);

        await postFeedback(feedbackData);

        alert("Feedback posted successfully!");

        setFeedback({
          title: "",
          body: "",
          stars: 0,
          dj: "",
          date: new Date(),
        });
      } catch (error) {
        console.error("Error posting feedback:", error);
        alert("Failed to post feedback. Please try again.");
      }
    } else {
      alert("Please select a booking to leave feedback.");
    }
  };

  if (loading) {
    return <Text>Loading bookings...</Text>;
  }

  const renderBooking = ({ item }: { item: Booking }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.bookingText}>DJ: {item.dj}</Text>
      <Text style={styles.bookingText}>
        Event Details: {item.event_details}
      </Text>
      <Text style={styles.bookingText}>
        Date: {new Date(item.date.seconds * 1000).toLocaleDateString()}
      </Text>
      <Text style={styles.bookingText}>Location: {item.location}</Text>
      <Text style={styles.bookingText}>Status: {item.status}</Text>
      <Button title="Leave Feedback" onPress={() => setSelectedBooking(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      {username && (
        <Text style={styles.currentUser}>Logged in as: {username}</Text>
      )}

      <Text style={styles.header}>Your Bookings</Text>

      {bookings.length === 0 ? (
        <Text>No bookings found.</Text>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item.date}
        />
      )}

      {selectedBooking && (
        <View style={styles.feedbackForm}>
          <Text style={styles.feedbackHeader}>
            Leave Feedback for DJ {selectedBooking.dj}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Feedback Title"
            value={feedback.title}
            onChangeText={(text) => setFeedback({ ...feedback, title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Feedback Body"
            value={feedback.body}
            onChangeText={(text) => setFeedback({ ...feedback, body: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Stars (1-5)"
            keyboardType="numeric"
            value={feedback.stars?.toString()}
            onChangeText={(text) => {
              const stars = Number(text);
              if (stars >= 1 && stars <= 5) {
                setFeedback({ ...feedback, stars });
              } else {
                alert("Please enter a valid rating between 1 and 5.");
              }
            }}
          />
          <Button title="Submit Feedback" onPress={handlePostFeedback} />
        </View>
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
  feedbackForm: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginTop: 20,
  },
  feedbackHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
});

export default UserManageBooking;
