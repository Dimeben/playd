import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getAllDjsList } from "../../firebase/firestore";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface DJ {
  id?: string;
  username: string;
  city: string;
  genres: string[];
  occasions: string[];
  price: number;
  profile_picture: string;
}

const DjList = () => {
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

  useEffect(() => {
    const fetchDjs = async () => {
      try {
        const djData = await getAllDjsList();
        const validDjs = djData.filter((dj) => dj.id !== undefined) as DJ[];
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
    <Pressable onPress={() => handleNavigateToProfile(item)}>
      <View style={styles.card}>
        {item.profile_picture && (
          <Image
            source={{
              uri: item.profile_picture || "https://via.placeholder.com/150",
            }}
            style={styles.profilePicture}
          />
        )}
        <View style={styles.cardContent}>
          {item.username && <Text style={styles.name}>{item.username}</Text>}
          {Array.isArray(item.genres) && item.genres.length > 0 && (
            <Text style={styles.genre}>{item.genres.join(", ")}</Text>
          )}
          {item.city && <Text style={styles.city}>{item.city}</Text>}
          {item.price !== undefined && (
            <Text style={styles.price}>Price: £{item.price}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>Filter DJs By:</Text>

        {/* City Picker */}
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

        {/* Genre Picker */}
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

        {/* Occasion Picker */}
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

        {/* Clear Filters Button */}
        <Button title="Clear All Filters" onPress={clearFilters} />

        {/* Filtered DJ List */}
        <FlatList
          data={filteredDjs}
          renderItem={renderDjCard}
          keyExtractor={(item, index) => item.id || index.toString()}
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
