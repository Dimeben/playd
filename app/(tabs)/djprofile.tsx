import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  getDJById,
  signOut,
  getFeedback,
  deleteDJ,
} from "../../firebase/firestore";
import { AuthContext } from "../../contexts/AuthContext";
import { DJ } from "../../firebase/types";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const DjProfilePage = () => {
  const { userId } = useContext(AuthContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [dj, setDj] = useState<DJ | null>(null);
  const [feedbackData, setFeedbackData] = useState<any[]>([]);

  const fetchFeedback = async () => {
    if (dj?.username) {
      try {
        const feedbackArray = await getFeedback(dj.username);
        setFeedbackData(feedbackArray);
      } catch (error) {
        return;
      }
    }
  };
  const fetchDjData = async () => {
    setIsLoading(true);
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const djData = await getDJById(userId);

      if (djData) {
        setDj(djData as DJ);
      } else {
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch DJ data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDjData();
  }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchDjData();
    }, [userId])
  );

  useEffect(() => {
    fetchFeedback();
  }, [dj?.username]);

  const renderStars = (rating: number) => {
    const totalStars = 5;
    const filledStars = "★".repeat(rating);
    const emptyStars = "☆".repeat(totalStars - rating);

    return filledStars + emptyStars;
  };

  const dateConvert = (seconds: number, nanoseconds: number) => {
    const millisFromSeconds = seconds * 1000;

    const millisFromNanos = nanoseconds / 1000000;

    const totalMillis = millisFromSeconds + millisFromNanos;

    const date = new Date(totalMillis);

    return date.toLocaleDateString();
  };

  const handleLogout = () => {
    signOut()
      .then(() => {
        Alert.alert("You have signed out!");
        router.push("../login");
      })
      .catch((err) => Alert.alert("User didn't sign out"));
  };

  const handleDelete = (userId) => {
    deleteDJ(userId).then(() => {
      Alert.alert("You have successfully deleted your account!");
      router.push("../login");
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, styles.container]}>
        <LinearGradient
          colors={["#00005B", "#A000CC", "#0040CC"]}
          style={styles.background}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="white"
              style={{ justifyContent: "center" }}
            />
            <Text style={styles.white}>Loading Profile...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (!dj) {
    return (
      <SafeAreaView>
        <Text style={styles.loginMessage}>You must login first!</Text>
        <Text></Text>
        <Link style={styles.button} href="/login">
          <Text style={styles.buttonText}>Login Screen</Text>
        </Link>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView />
      <LinearGradient
        colors={["#00005B", "#A000CC", "#0040CC"]}
        style={styles.background}
      >
        <Image
          style={styles.image}
          source={{
            uri:
              dj.profile_picture ??
              "https://www.shutterstock.com/image-photo/zhangjiajie-national-forest-park-unesco-260nw-2402891639.jpg",
          }}
        />

        <ScrollView>
          <View style={styles.container}>
            <View style={styles.icon}>
              <MaterialIcons name="manage-accounts" size={44} color="white" />
              <Text style={styles.header}> {dj.username}</Text>
            </View>
            <View style={styles.card}>
              <Pressable>
                <Text>Username: {dj.username}</Text>
                <Text>First Name: {dj.first_name}</Text>
                <Text>Surname: {dj.surname}</Text>
                <Text>City: {dj.city}</Text>
                <Text>
                  Genres:{" "}
                  {dj.genres.length > 1 ? dj.genres.join(", ") : dj.genres}
                </Text>
                <Text>
                  Occasions:{" "}
                  {dj.occasions.length > 1
                    ? dj.occasions.join(", ")
                    : dj.occasions}
                </Text>
                <Text>Price Per Hour: {dj.price}</Text>
                <Text>Rating: {renderStars(dj.rating)}</Text>
                <Text>Description: {dj.description}</Text>
              </Pressable>
              <Link
                style={styles.signupButton}
                href={{
                  pathname: "/editdjprofile",
                  params: { dj: dj },
                }}
              >
                <Text style={styles.linkText}>{"     "}Edit Profile</Text>
              </Link>
            </View>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleLogout}
            >
              <Text style={styles.linkText}>Logout</Text>
            </TouchableOpacity>
            <View style={styles.card}>
              <Text style={styles.heading}>Feedback</Text>
              <ScrollView contentContainerStyle={styles.feedbackContainer}>
                {feedbackData.length === 0 ? (
                  <Text>No Feedback Available</Text>
                ) : (
                  feedbackData.map((feedback) => (
                    <View key={feedback.id} style={styles.feedbackItem}>
                      <Text style={styles.feedbackTitle}>{feedback.title}</Text>
                      <Text style={styles.feedbackText}>
                        Author: {feedback.author}
                      </Text>
                      <Text style={styles.feedbackText}>
                        Titles: {feedback.title}
                      </Text>
                      <Text style={styles.feedbackText}>
                        Comment: {feedback.body}
                      </Text>
                      <Text style={styles.feedbackText}>
                        Rating: {renderStars(feedback.stars)}
                      </Text>
                      <Text style={styles.feedbackText}>
                        Date:{" "}
                        {dateConvert(
                          feedback.date.seconds,
                          feedback.date.nanoseconds
                        )}
                      </Text>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(userId)}
            >
              <Text style={styles.linkText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default DjProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  image: {
    flex: 1,
    width: "100%",
    minHeight: 150,
    maxHeight: 150,
    backgroundColor: "#0553",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    margin: 16,
    height: "auto",
    width: 320,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 2, height: 2 },
        shadowColor: "#333",
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "GeezaPro-Bold",
    marginBottom: 0,
    color: "white",
  },
  loginMessage: {
    fontSize: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginRight: "auto",
    marginLeft: "auto",
  },
  button: {
    padding: 10,
    backgroundColor: "#007AFF",
    width: "80%",
    alignItems: "center",
    marginRight: "auto",
    marginLeft: "auto",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  buttonTouch: {
    height: 47,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    margin: 5,
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
    borderRadius: 12,
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
  signupButton: {
    paddingRight: 40,
    paddingLeft: 40,
    paddingTop: 9,
    paddingBottom: 9,
    borderWidth: 1,
    backgroundColor: "#1c93ed",
    borderRadius: 14,
    borderRightWidth: 1,
    overflow: "hidden",
    margin: 10,
    alignSelf: "center",
    width: "81%",
  },
  deleteButton: {
    paddingRight: 40,
    paddingLeft: 40,
    paddingTop: 9,
    paddingBottom: 9,
    borderWidth: 1,

    backgroundColor: "red",
    borderRadius: 12,
    borderRightWidth: 1,
    overflow: "hidden",
    margin: 10,
    alignSelf: "center",
    width: "81%",
  },
  linkText: {
    color: "#fff",
    fontSize: 18,
    alignSelf: "center",
    fontWeight: "bold",
  },
  white: {
    color: "white",
  },
});
