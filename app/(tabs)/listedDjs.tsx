import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  Modal,
  SafeAreaView,
} from "react-native";
import { getAllDjs } from "../../firebase/firestore";
import { useRouter } from "expo-router";
import { DJ } from "../../firebase/types";

const DjList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [genreModalVisible, setGenreModalVisible] = useState(false);
  const [occasionModalVisible, setOccasionModalVisible] = useState(false);
  const [djs, setDjs] = useState<DJ[]>([]);
  const [filteredDjs, setFilteredDjs] = useState<DJ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>();
  const [selectedOccasion, setSelectedOccasion] = useState<
    string | undefined
  >();
  const router = useRouter();
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [genreOptions, setGenreOptions] = useState<string[]>([]);
  const [occasionOptions, setOccasionOptions] = useState<string[]>([]);

  const renderStars = (rating: number) => {
    const totalStars = 5;
    const filledStars = "★".repeat(rating);
    const emptyStars = "☆".repeat(totalStars - rating);

    return filledStars + emptyStars;
  };

  useEffect(() => {
    const fetchDjs = async () => {
      try {
        const djData = await getAllDjs();
        const validDjs = djData.filter((dj): dj is DJ => {
          return (
            dj.id !== undefined &&
            dj.first_name !== undefined &&
            dj.surname !== undefined &&
            dj.username !== undefined &&
            dj.city !== undefined &&
            Array.isArray(dj.genres) &&
            Array.isArray(dj.occasions) &&
            typeof dj.price === "number" &&
            (typeof dj.profile_picture === "string" ||
              dj.profile_picture === null)
          );
        });
        setDjs(validDjs);
        setCityOptions([...new Set(validDjs.map((dj) => dj.city))]);
        setGenreOptions([...new Set(validDjs.flatMap((dj) => dj.genres))]);
        setOccasionOptions([
          ...new Set(validDjs.flatMap((dj) => dj.occasions)),
        ]);
        setFilteredDjs(validDjs);
      } catch (error) {
        console.error("Error fetching DJs: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDjs();
  }, []);

  const handleCityChange = (city: string | undefined) => {
    setSelectedCity(city);
    setModalVisible(false);
  };

  const handleGenreChange = (genre: string | undefined) => {
    setSelectedGenre(genre);
    setGenreModalVisible(false);
  };

  const handleOccasionChange = (occasion: string | undefined) => {
    setSelectedOccasion(occasion);
    setOccasionModalVisible(false);
  };

  const clearFilters = () => {
    setSelectedCity(undefined);
    setSelectedGenre(undefined);
    setSelectedOccasion(undefined);
    setFilteredDjs(djs);
  };

  useEffect(() => {
    let filtered = [...djs];

    if (selectedCity) {
      filtered = filtered.filter((dj) => dj.city === selectedCity);
    }

    if (selectedGenre) {
      filtered = filtered.filter(
        (dj) => Array.isArray(dj.genres) && dj.genres.includes(selectedGenre)
      );
    }

    if (selectedOccasion) {
      filtered = filtered.filter(
        (dj) =>
          Array.isArray(dj.occasions) && dj.occasions.includes(selectedOccasion)
      );
    }

    setFilteredDjs(filtered);
  }, [selectedCity, selectedGenre, selectedOccasion, djs]);

  const handleNavigateToProfile = (dj: DJ) => {
    router.push({
      pathname: "/bookdj",
      params: { dj: JSON.stringify(dj) },
    });
  };

  const renderDjCard = ({ item }: { item: DJ }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleNavigateToProfile(item)}
    >
      <Image
        source={{
          uri: item.profile_picture || "https://via.placeholder.com/150",
        }}
        style={styles.profilePicture}
        accessibilityLabel={`Profile picture of ${item.first_name} ${item.surname}`}
      />
      <Text style={styles.name}>
        {item.first_name} {item.surname}
      </Text>
      {Array.isArray(item.genres) && item.genres.length > 0 && (
        <Text style={styles.genre}>Genre: {item.genres.join(", ")}</Text>
      )}
      <Text style={styles.occasions}>
        Occasions: {item.occasions.join(", ")}
      </Text>
      <Text style={styles.price}>Price: £{item.price}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.rating}>Rating: {renderStars(item.rating)}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Filter DJs By:</Text>

        {/* City Picker */}
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setModalVisible(true)}
        >
          <Text>{selectedCity || "Select City"}</Text>
        </TouchableOpacity>

        {/* Genre Picker */}
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setGenreModalVisible(true)}
        >
          <Text>{selectedGenre || "Select Genre"}</Text>
        </TouchableOpacity>

        {/* Occasion Picker */}
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setOccasionModalVisible(true)}
        >
          <Text>{selectedOccasion || "Select Occasion"}</Text>
        </TouchableOpacity>

        {/* City Modal */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalList}>
              <FlatList
                data={cityOptions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleCityChange(item)}
                    style={styles.item}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Genre Modal */}
        <Modal
          transparent={true}
          visible={genreModalVisible}
          animationType="slide"
          onRequestClose={() => setGenreModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalList}>
              <FlatList
                data={genreOptions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleGenreChange(item)}
                    style={styles.item}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                onPress={() => setGenreModalVisible(false)}
                style={styles.closeButton}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Occasion Modal */}
        <Modal
          transparent={true}
          visible={occasionModalVisible}
          animationType="slide"
          onRequestClose={() => setOccasionModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalList}>
              <FlatList
                data={occasionOptions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleOccasionChange(item)}
                    style={styles.item}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                onPress={() => setOccasionModalVisible(false)}
                style={styles.closeButton}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Button title="Clear All Filters" onPress={clearFilters} />

        <FlatList
          data={filteredDjs}
          renderItem={renderDjCard}
          keyExtractor={(item, index) => item.username || index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

export default DjList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 10,
  },
  card: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 15,
    elevation: 3,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  genre: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  occasions: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    marginTop: 5,
    color: "black",
  },
  description: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
  rating: {
    fontSize: 14,
    color: "blue",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingTop: 50,
  },
  modalList: {
    backgroundColor: "white",
    maxHeight: "70%",
  },
  item: {
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  closeButton: {
    padding: 15,
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 10,
  },
});
