import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { createBooking } from "../../firebase/firestore";
import moment from "moment"; 

const BookDj = () => {
  const router = useRouter();
  const { dj } = useLocalSearchParams();

  const selectedDj = Array.isArray(dj)
    ? JSON.parse(dj[0]) 
    : dj 
    ? JSON.parse(dj)
    : null;

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

  const handleDateInput = (text: string) => {
    const cleanedText = text.replace(/\D/g, "");
    let formattedText = cleanedText;

    
    if (cleanedText.length >= 3) {
      formattedText = cleanedText.slice(0, 2) + "/" + cleanedText.slice(2);
    }
    if (cleanedText.length >= 5) {
      formattedText = cleanedText.slice(0, 2) + "/" + cleanedText.slice(2, 4) + "/" + cleanedText.slice(4, 8);
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

    
      const combinedDateTime = moment(`${newBooking.date} ${newBooking.time}`, "DD/MM/YYYY HH:mm").toDate();

      const bookingWithDateTime = {
        ...newBooking,
        date: combinedDateTime, 
      };

      createBooking(bookingWithDateTime);
      alert("Booking created successfully!");
      router.back(); 
    } catch (error) {
      console.error("Error creating booking: ", error);
      alert("There was an error creating your booking. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* DJ Card at the Top */}
      {selectedDj && (
        <View style={styles.djCard}>
          <Image
            source={{ uri: selectedDj.profile_picture || 'https://via.placeholder.com/150' }}
            style={styles.profilePicture}
          />
          <View style={styles.cardContent}>
            <Text style={styles.name}>{selectedDj.username}</Text>
            <Text style={styles.genre}>{selectedDj.genres.join(", ")}</Text>
            <Text style={styles.city}>{selectedDj.city}</Text>
            <Text style={styles.price}>Price: ${selectedDj.price}</Text>
          </View>
        </View>
      )}

      {/* Booking Form */}
      <Text style={styles.header}>Create a New Booking</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={newBooking.client}
        onChangeText={(text) => setNewBooking({ ...newBooking, client: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Details"
        value={newBooking.event_details}
        onChangeText={(text) => setNewBooking({ ...newBooking, event_details: text })}
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
        placeholder="Event Location"
        value={newBooking.location}
        onChangeText={(text) => setNewBooking({ ...newBooking, location: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Occasion"
        value={newBooking.occasion}
        onChangeText={(text) => setNewBooking({ ...newBooking, occasion: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Additional Comments"
        value={newBooking.comments}
        onChangeText={(text) => setNewBooking({ ...newBooking, comments: text })}
      />

      <Button title="Submit Booking" onPress={handleBookingSubmit} />
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
});

export default BookDj;
