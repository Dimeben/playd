import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const FeedbackForSingleDj = () => {
  const [feedback, setFeedback] = useState("");
  const feedRef = doc(db, "feedback", `GSZ6GaZzXoWDE8LUA0n3`);
  useEffect(() => {
    const getFeedbackData = () => {
      getDoc(feedRef).then((data) => {
        const snapDoc = data.data();
        if (snapDoc) {
          setFeedback(snapDoc);
        } else console.log("Doesnt exist");
      });
    };
    getFeedbackData();
  }, []);

  return (
    <View>
      <Pressable>
        <Text>Author: {feedback.author}</Text>
        <Text>Stars: {feedback.first_name}</Text>
        <Text>Title: {feedback.surname}</Text>
        <Text>{feedback.body}</Text>
      </Pressable>
    </View>
  );
};

export default FeedbackForSingleDj;
