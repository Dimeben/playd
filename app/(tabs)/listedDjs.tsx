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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getAllDjs } from "../../firebase/firestore";
import { useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DJ } from "../../firebase/types";

const DjList = () => {
  const [djs, setDjs] = useState<import("../../firebase/types").DJ[]>([]);
  const [filteredDjs, setFilteredDjs] = useState<
    import("../../firebase/types").DJ[]
  >([]);
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
    setSelectedGenre(undefined);
    setSelectedOccasion(undefined);
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
      pathname: "/(tabs)/bookdj",
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
      <Text style={styles.occasions}>Occasions: {item.occasions}</Text>
      <Text style={styles.price}>Price: £{item.price}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.rating}>Rating: {item.rating}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>Filter DJs By:</Text>

        <Picker
          selectedValue={selectedCity}
          style={styles.picker}
          onValueChange={(itemValue) => handleCityChange(itemValue)}
        >
          <Picker.Item label="Select City" value={undefined} />
          {cityOptions.map((city, index) => (
            <Picker.Item key={index} label={city} value={city} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedGenre}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedGenre(itemValue)}
          enabled={!!selectedCity}
        >
          <Picker.Item label="Select Genre" value={undefined} />
          {genreOptions.map((genre, index) => (
            <Picker.Item key={index} label={genre} value={genre} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedOccasion}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedOccasion(itemValue)}
          enabled={!!selectedCity}
        >
          <Picker.Item label="Select Occasion" value={undefined} />
          {occasionOptions.map((occasion, index) => (
            <Picker.Item key={index} label={occasion} value={occasion} />
          ))}
        </Picker>

        <Button title="Clear All Filters" onPress={clearFilters} />

        <FlatList
          data={filteredDjs}
          renderItem={renderDjCard}
          keyExtractor={(item, index) => item.username || index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </GestureHandlerRootView>
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
    height: 50,
    width: "100%",
    marginBottom: 20,
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
  city: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
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
    color: "orange",
    marginTop: 5,
  },
});
