import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { patchDj, getDjById } from "../../firebase/firestore";


interface DJProfile {
  first_name?: string;
  surname?: string;
  username: string;
  city: string;
  price: string;
  description: string;
  genres?: string[];
  occasions?: string[];
}

const EditDjProfile = () => {
  const router = useRouter();
  const { userId } = useContext(AuthContext);
  const [dj, setDj] = useState<DJProfile | null>(null);
  const [updateFields, setUpdateFields] = useState<DJProfile>({
    first_name: "",
    surname: "",
    username: "",
    city: "",
    price: "",
    description: "",
    genres: [],
    occasions: [],
  });

  const [updateMessage, setUpdateMessage] = useState("");
  const [goBackIsVisible, setGoBackIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDjData = async () => {
      if (!userId) {
        console.log("User ID is null");
        setIsLoading(false);
        return;
      }
      try {
        const djData = await getDjById(userId);
        if (djData) {
          setDj(djData);
          setUpdateFields(djData);
        } else {
          console.log("DJ doesn't exist");
        }
      } catch (error) {
        console.log((error as Error).message);
        Alert.alert("Error", "Failed to fetch DJ data. Please try again.");
      }
      setIsLoading(false);
    };

    getDjData();
  }, [userId]);

  const handleInputChange = (field: keyof DJProfile, value: string) => {
    setUpdateFields((prev) => ({ ...prev, [field]: value }));
  };

  const validateFields = () => {
    for (const key in updateFields) {
      if (updateFields[key as keyof DJProfile] === "") {
        Alert.alert("Validation Error", `${key} cannot be empty.`);
        return false;
      }
    }
    return true;
  };

  const updateDjProfile = async () => {
    if (!validateFields()) return;
    try {
      const updatedData = {
        ...updateFields,
        price: updateFields.price ? parseFloat(updateFields.price) : undefined, 
      };
      const updatedDj = await patchDj(userId, updatedData);
      setDj(updatedDj);
      setUpdateMessage("Successfully Updated Profile");
      setGoBackIsVisible(true);
    } catch (err) {
      console.error(err.message);
      Alert.alert("Update Failed", err.message);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <SafeAreaView />
        <Text style={styles.heading}>Edit Your Profile:</Text>
        {isLoading ? ( 
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {goBackIsVisible && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.back()}
              >
                <Text style={styles.buttonText}>Go Back</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.messageText}>{updateMessage}</Text>
            {Object.keys(updateFields).map((key) => (
              <View key={key} style={styles.formContainer}>
                <TextInput
                  placeholder={`Enter your ${key}...`}
                  placeholderTextColor={"black"}
                  value={updateFields[key as keyof DJProfile].toString()}
                  onChangeText={(value) => handleInputChange(key as keyof DJProfile, value)}
                  style={styles.input}
                  underlineColorAndroid="transparent"
                />
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={updateDjProfile}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default EditDjProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 30,
  },
  formContainer: {
    flexDirection: "row",
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    height: 48,
    borderWidth: 2,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
    fontSize: 20,
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: "#788eec",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    margin: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  messageText: {
    marginBottom: 10,
  },
});
