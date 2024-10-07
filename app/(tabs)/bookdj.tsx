import React, { useEffect, useState, useMemo, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { createBooking, getFeedback } from "../../firebase/firestore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import moment from "moment";
import { AuthContext } from "../../contexts/AuthContext";

const BookDj = () => {
  const router = useRouter();
  const { dj } = useLocalSearchParams();
  const { username } = useContext(AuthContext);
  const selectedDj = useMemo(() => {
    return Array.isArray(dj) ? JSON.parse(dj[0]) : dj ? JSON.parse(dj) : null;
  }, [dj]);

  const [showBookingForm, setShowBookingForm] = useState(false); // Toggle state for form
  const [newBooking, setNewBooking] = useState({
    client: "",
    comments: "",
    event_details: "",
    date: "",
    time: "",
    location: "",
    occasion: "",
    dj: selectedDj?.username || "",
  });

  const [feedbackData, setFeedbackData] = useState<any[]>([]);

  useEffect(() => {
    console.log("bookdj useEffect - Line 40");
    const fetchFeedback = async () => {
      if (selectedDj?.username) {
        try {
          const feedbackArray = await getFeedback(selectedDj.username);
          setFeedbackData(feedbackArray);
        } catch (error) {
          console.error("Error fetching feedback: ", error);
        }
      }
    };

    if (selectedDj) {
      fetchFeedback();
      setNewBooking({
        ...newBooking,
        client: username,
        dj: selectedDj.username,
      });
    }
  }, [selectedDj]);

  const renderStars = (rating: number) => {
    const totalStars = 5;
    const filledStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(totalStars - rating);
  
    return filledStars + emptyStars; // Concatenate filled and empty stars
  };

  const handleDateInput = (text: string) => {
    const cleanedText = text.replace(/\D/g, "");
    let formattedText = cleanedText;

    if (cleanedText.length >= 3) {
      formattedText = cleanedText.slice(0, 2) + "/" + cleanedText.slice(2);
    }
    if (cleanedText.length >= 5) {
      formattedText =
        cleanedText.slice(0, 2) +
        "/" +
        cleanedText.slice(2, 4) +
        "/" +
        cleanedText.slice(4, 8);
    }

    setNewBooking({ ...newBooking, date: formattedText });
  };

  const handleTimeInput = (text: string) => {
    const cleanedText = text.replace(/\D/g, "");
    let formattedText = cleanedText;

    if (cleanedText.length >= 3) {
      formattedText = cleanedText.slice(0, 2) + ":" + cleanedText.slice(2);
    }

    setNewBooking({ ...newBooking, time: formattedText });
  };

  const handleBookingSubmit = () => {
    try {
      const [day, month, year] = newBooking.date.split("/");
      const formattedDate = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");
  
      if (!formattedDate.isValid()) {
        alert("Invalid date format. Please use dd/mm/yyyy format.");
        return;
      }
  
      const formattedTime = moment(newBooking.time, "HH:mm", true);
      if (!formattedTime.isValid()) {
        alert("Invalid time format. Please use HH:mm format.");
        return;
      }
  
      const combinedDateTime = moment(
        `${newBooking.date} ${newBooking.time}`,
        "DD/MM/YYYY HH:mm"
      ).toDate();
  
      const { time, ...bookingWithoutTime } = newBooking;
      const bookingWithDateTime = {
        ...bookingWithoutTime,
        date: combinedDateTime,
        status: "pending",
      };
  
      createBooking(bookingWithDateTime);
      alert("Booking request sent!");
      router.back();
    } catch (error) {
      console.error("Error creating booking: ", error);
      alert("There was an error creating your booking. Please try again.");
    }
  };
  
  const toggleForm = () => {
    setShowBookingForm(!showBookingForm);
  };

  return (
    <View style={styles.container}>
      {selectedDj && (
        <View style={styles.djCard}>
          <Image
            source={{
              uri:
                selectedDj.profile_picture || "https://via.placeholder.com/150",
            }}
            style={styles.profilePicture}
          />
          <View style={styles.cardContent}>
            <Text style={styles.name}>
              {selectedDj.first_name} {selectedDj.surname}
            </Text>
            <Text style={styles.genre}>
              Genre: {selectedDj.genres.join(", ")}
            </Text>
            <Text style={styles.city}>Location: {selectedDj.city}</Text>
            <Text style={styles.price}>Price: £{selectedDj.price}</Text>
            <Text style={styles.description}>
              Description: {selectedDj.description}
            </Text>
            <Text style={styles.rating}>Rating: {selectedDj.rating}</Text>
          </View>
        </View>
      )}

      <Text style={styles.header}>Reviews</Text>
      <GestureHandlerRootView style={styles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.feedbackContainer}>
          {feedbackData.length === 0 ? (
            <Text>No Feedback Available</Text>
          ) : (
            feedbackData.map((feedback) => (
              <View key={feedback.id} style={styles.feedbackItem}>
                <Text style={styles.feedbackTitle}>{feedback.title}</Text>
                <Text style={styles.feedbackText}>By: {feedback.author}</Text>
                <Text style={styles.feedbackText}>
                  Comment: {feedback.body}
                </Text>
                <Text style={styles.feedbackText}>
                  Rating: {renderStars(feedback.stars)}
                </Text>
                <Text style={styles.feedbackText}>
                  Date:{" "}
                  {moment(feedback.date).format("DD MMMM YYYY [at] HH:mm:ss")}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </GestureHandlerRootView>

      {/* Toggle button for showing/hiding the booking form */}
      <TouchableOpacity onPress={toggleForm} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>{showBookingForm ? "Hide Booking Form" : "Book a DJ"}</Text>
      </TouchableOpacity>

      {showBookingForm && (
        <>
          <Text style={styles.header}>Create a New Booking</Text>
          <TextInput
            style={styles.input}
            placeholder="Event Location"
            value={newBooking.location}
            onChangeText={(text) =>
              setNewBooking({ ...newBooking, location: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Occasion"
            value={newBooking.occasion}
            onChangeText={(text) =>
              setNewBooking({ ...newBooking, occasion: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Event Details"
            value={newBooking.event_details}
            onChangeText={(text) =>
              setNewBooking({ ...newBooking, event_details: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Event Date (dd/mm/yyyy)"
            value={newBooking.date}
            onChangeText={handleDateInput}
            maxLength={10}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Event Time (HH:mm)"
            value={newBooking.time}
            onChangeText={handleTimeInput}
            maxLength={5}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Additional Comments"
            value={newBooking.comments}
            onChangeText={(text) =>
              setNewBooking({ ...newBooking, comments: text })
            }
          />
          <Button title="Submit Booking" onPress={handleBookingSubmit} />
        </>
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
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  djCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  cardContent: {
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  genre: {
    fontSize: 14,
    color: "#555",
  },
  city: {
    fontSize: 14,
    color: "#999",
  },
  price: {
    fontSize: 14,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  rating: {
    fontSize: 14,
    color: "blue",
  },
  scrollContainer: {
    flex: 1,
  },
  feedbackContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "black",
    marginVertical: 5,
  },
  feedbackUser: {
    fontWeight: "bold",
  },
  feedbackComment: {
    fontStyle: "normal",
  },
  feedbackItem: {
    marginBottom: 15,
    padding: 12,
    borderRadius: 5,
    backgroundColor: "white",
    borderWidth: 1,
  },
  feedbackText: {
    fontSize: 12,
    color: "black",
    marginBottom: 4,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "Black",
  },
  toggleButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default BookDj;
