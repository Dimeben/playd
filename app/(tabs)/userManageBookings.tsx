import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Button,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getAuth } from "firebase/auth";
import { getBookingsByUser, postFeedback } from "../../firebase/firestore";
import { Booking, Feedback } from "../../firebase/types";

const UserManageBookings = () => {
  const { username } = useContext(AuthContext);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [feedback, setFeedback] = useState({
    title: "",
    body: "",
    stars: 0,
    dj: "",
    date: new Date(),
  } as Partial<Feedback>);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (username) {
        try {
          const bookings = await getBookingsByUser(username);
          setBookings(bookings);
        } catch (error) {
          console.error("Error fetching user bookings:", error);
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

  const dateConvert = (seconds: number, nanoseconds: number) => {
    const millisFromSeconds = seconds * 1000;

    const millisFromNanos = nanoseconds / 1000000;

    const totalMillis = millisFromSeconds + millisFromNanos;

    const date = new Date(totalMillis);

    return date.toLocaleDateString();
  };

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80}
    >
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  header: {
    fontSize: 18,
    fontWeight: "bold",
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

export default UserManageBookings;
