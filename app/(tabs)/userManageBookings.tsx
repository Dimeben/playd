import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getAuth } from "firebase/auth";
import {
  getBookingsByUser,
  postFeedback,
  patchDJByUsername,
  getFeedback,
} from "../../firebase/firestore";
import { Booking, Feedback } from "../../firebase/types";
import { Timestamp } from "firebase/firestore";

const UserManageBookings = () => {
  const { username } = useContext(AuthContext);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [feedback, setFeedback] = useState<Partial<Feedback>>({
    title: "",
    body: "",
    stars: 0,
    dj: "",
    date: new Date(),
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [feedbackFormVisible, setFeedbackFormVisible] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      if (username) {
        try {
          const bookings = await getBookingsByUser(username);
          setBookings(bookings);
        } catch (error) {
          console.error("Error fetching user bookings:", error);
        }
      }
      setLoading(false);
    };
    fetchBookings();
  }, [username]);

  const handlePostFeedback = async (bookingId: string) => {
    const selected = bookings.find((booking) => booking.id === bookingId);
    setSelectedBooking(selected || null);

    if (selected) {
      try {
        const feedbackData: Feedback = {
          author:
            username || currentUser?.email || currentUser?.uid || "Anonymous",
          title: feedback.title?.trim() || "",
          body: feedback.body?.trim() || "",
          stars: feedback.stars || 0,
          dj: selected.dj,
          date: new Date(),
        };

        await postFeedback(feedbackData);

        const djFeedbacks = await getFeedback(selected.dj);
        const totalRatings = djFeedbacks.reduce(
          (acc, curr) => acc + (curr.stars || 0),
          feedbackData.stars
        );
        const averageRating = Math.floor(
          totalRatings / (djFeedbacks.length + 1)
        );

        await patchDJByUsername(selected.dj, { rating: averageRating });

        setFeedback({
          title: "",
          body: "",
          stars: 0,
          dj: "",
          date: new Date(),
        });
        setFeedbackFormVisible(null);

        alert("Feedback posted successfully! DJ's rating updated.");
      } catch (error) {
        console.error("Error posting feedback or updating DJ rating:", error);
        alert("Failed to post feedback. Please try again.");
      }
    } else {
      alert("Please select a booking to leave feedback.");
    }
  };

  const renderBooking = ({ item }: { item: Booking }) => {
    const bookingDate =
      item.date instanceof Timestamp
        ? item.date.toDate().toLocaleDateString()
        : item.date.toLocaleDateString();

    return (
      <View style={styles.bookingCard}>
        <Text style={styles.bookingText}>DJ: {item.dj}</Text>
        <Text style={styles.bookingText}>
          Event Details: {item.event_details}
        </Text>
        <Text style={styles.bookingText}>Date: {bookingDate}</Text>
        <Text style={styles.bookingText}>Location: {item.location}</Text>
        <Text style={styles.bookingText}>Status: {item.status}</Text>
        <Button
          title={
            feedbackFormVisible === item.id
              ? "Hide Feedback Form"
              : "Leave Feedback"
          }
          onPress={() =>
            setFeedbackFormVisible(
              feedbackFormVisible === item.id ? null : item.id
            )
          }
        />
        {feedbackFormVisible === item.id && (
          <View style={styles.feedbackForm}>
            <Text style={styles.feedbackHeader}>
              Leave Feedback for DJ {item.dj}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Feedback Title"
              value={feedback.title || ""}
              onChangeText={(text) =>
                setFeedback((prevFeedback) => ({
                  ...prevFeedback,
                  title: text,
                }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Feedback Body"
              value={feedback.body || ""}
              onChangeText={(text) =>
                setFeedback((prevFeedback) => ({
                  ...prevFeedback,
                  body: text,
                }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Stars (1-5)"
              keyboardType="numeric"
              value={feedback.stars?.toString() || ""}
              onChangeText={(text) => {
                const stars = Number(text);
                if (stars >= 1 && stars <= 5) {
                  setFeedback((prevFeedback) => ({
                    ...prevFeedback,
                    stars,
                  }));
                } else {
                  alert("Please enter a valid rating between 1 and 5.");
                }
              }}
            />
            <Button
              title="Submit Feedback"
              onPress={() => handlePostFeedback(item.id)}
            />
            <Button
              title="Cancel"
              color="red"
              onPress={() => setFeedbackFormVisible(null)}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80}
      >
        <Text style={styles.header}>Your Bookings</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : bookings.length === 0 ? (
          <Text style={styles.noBookingsText}>No bookings requested.</Text>
        ) : (
          <FlatList
            data={bookings}
            renderItem={renderBooking}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
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
  currentUser: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 10,
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
  feedbackForm: {
    padding: 16,
    backgroundColor: "#FFFFFF",
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
  noBookingsText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});

export default UserManageBookings;
