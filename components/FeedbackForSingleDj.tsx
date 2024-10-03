import { View, Text, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "@/contexts/AuthContext";

const FeedbackForSingleDj = () => {
  const { userId, username } = useContext(AuthContext);
  //   const [feedback, setFeedback] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  //   const feedRef = doc(db, "feedback", `GSZ6GaZzXoWDE8LUA0n3`);
  const feedbackCollectionRef = collection(db, "feedback");
  //   useEffect(() => {
  //     const getFeedbackData = () => {
  //       getDoc(feedRef).then((data) => {
  //         const snapDoc = data.data();
  //         if (snapDoc) {
  //           setFeedback(snapDoc);
  //         } else console.log("Doesnt exist");
  //       });
  //     };
  //     getFeedbackData();
  //   }, []);

  const getFeedbackList = () => {
    const data = getDocs(feedbackCollectionRef).then((feedback) => {
      const filteredData = feedback.docs.map((individualFeedback) => {
        return { ...individualFeedback.data(), id: individualFeedback.id };
      });
      setFeedbackList(filteredData);
    });
  };

  useEffect(() => {
    getFeedbackList();
  }, []);

  return (
    <View>
      {username === feedbackList.username ? (
        feedbackList.map((feedback) => {
          return (
            <Pressable key={feedback.id}>
              <Text>Author: {feedback.author}</Text>
              <Text>Dj: {feedback.dj}</Text>
              <Text>Stars: {feedback.first_name}</Text>
              <Text>Title: {feedback.surname}</Text>
              <Text>{feedback.body}</Text>
            </Pressable>
          );
        })
      ) : (
        <Text>No feedback yet!</Text>
      )}
    </View>
  );
};

export default FeedbackForSingleDj;
