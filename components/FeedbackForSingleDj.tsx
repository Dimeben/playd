import { View, Text, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { DJ } from "../firebase/types";
import { getFeedbackByDj } from "../firebase/firestore";

interface FeedbackForSingleDjProps {
  dj: DJ;
}

interface Feedback {
  id: string;
  author: string;
  dj: string;
  stars: number;
  title: string;
  body: string;
}

const FeedbackForSingleDj: React.FC<FeedbackForSingleDjProps> = ({ dj }) => {
  const { username } = useContext(AuthContext);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      const feedbackData: any = await getFeedbackByDj(dj.id);
      setFeedbackList(feedbackData);
    };

    fetchFeedback();
  }, [dj.id]);

  return (
    <View>
      {feedbackList.length > 0 ? (
        feedbackList.map((feedback) => (
          <Pressable key={feedback.id}>
            <Text>Author: {feedback.author}</Text>
            <Text>DJ: {feedback.dj}</Text>
            <Text>Stars: {feedback.stars}</Text>
            <Text>Title: {feedback.title}</Text>
            <Text>{feedback.body}</Text>
          </Pressable>
        ))
      ) : (
        <Text>No feedback yet!</Text>
      )}
    </View>
  );
};

export default FeedbackForSingleDj;
