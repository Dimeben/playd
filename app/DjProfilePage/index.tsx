import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React from "react";

const DjProfilePage = () => {
  // const docRef = doc(db, "djs", "8vG3IgzUQu3HvzBDpAEv");

  // getDoc(docRef).then((data) => {
  //   console.log(data);
  //   return data._document.data.value.mapValue.fields;
  // });
  interface newDjType {
    username: string;
    first_name: string;
    surname: string;
    city: string;
    genre: string;
    avatar_url: string;
    Occasions: string;
    Price: number;
    Description: string;
  }
  const newDj: newDjType[] = [
    {
      username: "megaDJ",
      first_name: "David",
      surname: "Smith",
      city: "Leeds",
      avatar_url: "https://picsum.photos/seed/696/3000/2000",
      genre: "House",
      Occasions: "Club Nights",
      Price: 50,
      Description: "I just love DJing!",
    },
  ];

  const feedbackData = [
    {
      id: 1,
      stars: 2,
      title: "Great",
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad mollitia, voluptate necessitatibus distinctio illum reprehenderit",
      username: "Gabby123",
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Text style={styles.heading}>{newDj[0].username}</Text>

      <Image
        style={styles.image}
        source={{ uri: newDj[0].avatar_url }}
        contentFit="cover"
      />

      <View style={styles.card}>
        <FlatList
          data={newDj}
          keyExtractor={(item) => item.username}
          renderItem={({ item }) => {
            return (
              <Pressable>
                <Text>Username: {item.username}</Text>
                <Text>First Name: {item.first_name}</Text>
                <Text>Surname: {item.surname}</Text>
                <Text>City: {item.city}</Text>
                <Text>Genre: {item.genre}</Text>
                <Text>Occasions: {item.Occasions}</Text>
                <Text>Price: {item.Price}</Text>
                <Text>Description: {item.Description}</Text>
              </Pressable>
            );
          }}
        />
      </View>
      <View style={styles.card}>
        <FlatList
          data={feedbackData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <Pressable>
                <ScrollView>
                  <Text>Username: {item.username}</Text>
                  <Text>Stars: {item.stars}</Text>
                  <Text>Title: {item.title}</Text>
                  <Text>{item.body}</Text>
                </ScrollView>
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
};

export default DjProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    maxHeight: 200,
    backgroundColor: "#0553",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    margin: 16,
    height: 180,
    width: "80%",
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
  heading: {
    fontSize: "30%",
  },
});
