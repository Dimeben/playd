import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getAuth } from "firebase/auth";
import {
  getBookingsByUser,
  postFeedback,
  patchDJByUsername,
  getFeedback,
  updateBooking,
} from "../../firebase/firestore";
import { useFocusEffect } from "expo-router";
import { Booking, Feedback } from "../../firebase/types";
import { Timestamp } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

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
  const [feedbackFormVisible, setFeedbackFormVisible] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const fetchBookings = async () => {
    setLoading(true);
    if (username) {
      try {
        const fetchedBookings = await getBookingsByUser(username);

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

        setBookings(sortedBookings);
      } catch (error) {
        return;
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [username]);

  useFocusEffect(
    React.useCallback(() => {
      fetchBookings();
    }, [username])
  );

  const handlePostFeedback = async (bookingId: string) => {
    const selected = bookings.find((booking) => booking.id === bookingId);
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

        if (feedbackData.stars < 1 || feedbackData.stars > 5) {
          Alert.alert("Please enter a valid rating between 1 and 5.");
          return;
        }

        if (!feedbackData.title || !feedbackData.stars || !feedback.body) {
          Alert.alert("Please complete all fields");
          return;
        }

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

        await updateBooking(bookingId, { feedback_left: true });

        setFeedback({
          title: "",
          body: "",
          stars: 0,
          dj: "",
          date: new Date(),
        });
        setFeedbackFormVisible(null);
        await fetchBookings();
        Alert.alert("Feedback posted successfully! DJ's rating updated.");
      } catch (error) {
        Alert.alert("Failed to post feedback. Please try again.");
      }
    } else {
      Alert.alert("Please select a booking to leave feedback.");
    }
  };

  const renderBooking = ({ item }: { item: Booking }) => {
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

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    bookingDate.setHours(0, 0, 0, 0);

    const canLeaveFeedback =
      currentDate > bookingDate &&
      item.feedback_left !== true &&
      item.status === "accepted";

    return (
      <View style={styles.bookingCard}>
        <Text style={styles.djbookingText}>DJ: {item.dj}</Text>
        <Text style={styles.bookingText}>
          Event Details: {item.event_details}
        </Text>
        <Text style={styles.bookingText}>Comments: {item.comments}</Text>
        <Text style={styles.bookingText}>Date: {bookingDateFormatted}</Text>
        <Text style={styles.bookingText}>Time: {bookingTimeFormatted}</Text>
        <Text style={styles.bookingText}>Location: {item.location}</Text>
        <Text
          style={[
            styles.statusBookingText,
            {
              color:
                item.status === "accepted"
                  ? "green"
                  : item.status === "pending"
                  ? "blue"
                  : item.status === "declined"
                  ? "red"
                  : "black",
            },
          ]}
        >
          Status:{" "}
          {item.status === "accepted"
            ? "Booking Accepted"
            : item.status === "declined"
            ? "Booking Declined"
            : "Pending Decision"}
        </Text>

        {canLeaveFeedback ? (
          <>
            <TouchableOpacity
              style={[
                styles.feedbackButton,
                feedbackFormVisible === item.id
                  ? styles.hideFeedbackButton
                  : styles.leaveFeedbackButton,
              ]}
              onPress={() =>
                setFeedbackFormVisible(
                  feedbackFormVisible === item.id ? null : item.id
                )
              }
            >
              <Text style={styles.feedbackButtonText}>
                {feedbackFormVisible === item.id
                  ? "Hide Feedback Form"
                  : "Leave Feedback"}
              </Text>
            </TouchableOpacity>

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
                  onChangeText={(text) => {
                    const stars = Number(text);
                    setFeedback((prevFeedback) => ({
                      ...prevFeedback,
                      stars,
                    }));
                  }}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => handlePostFeedback(item.id)}
                >
                  <Text style={styles.submitButtonText}>Submit Feedback</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setFeedbackFormVisible(null),
                      setFeedback({
                        title: "",
                        body: "",
                        stars: 0,
                        dj: "",
                        date: new Date(),
                      });
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : null}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#00005B", "#A000CC", "#0040CC"]}
      style={styles.gradientBackground}
    >
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  safeContainer: {
    flex: 1,
  },
  bookingCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f2f0f7",
    borderRadius: 12,
    shadowColor: "grey",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  currentUser: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  bookingText: {
    fontSize: 14,
    marginBottom: 5,
    color: "black",
  },
  djbookingText: {
    fontSize: 16,
    marginBottom: 5,
    color: "black",
    fontWeight: "bold",
  },
  statusBookingText: {
    fontSize: 14,
    marginBottom: 5,
    color: "black",
    fontWeight: "bold",
  },
  feedbackForm: {
    padding: 16,
    backgroundColor: "#f2f0f7",
    borderRadius: 12,
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
    borderRadius: 12,
  },
  noBookingsText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  gradientBackground: {
    flex: 1,
  },
  feedbackButton: {
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  leaveFeedbackButton: {
    backgroundColor: "#007AFF",
  },
  hideFeedbackButton: {
    backgroundColor: "#007AFF",
  },
  feedbackButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "green",
    fontWeight: "bold",
    fontSize: 16,
    borderRadius: 12,
    padding: 8,
    marginTop: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "red",
    fontWeight: "bold",
    fontSize: 16,
    borderRadius: 12,
    padding: 8,
    marginTop: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default UserManageBookings;
