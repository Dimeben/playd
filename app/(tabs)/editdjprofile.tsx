import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { patchDj } from "../../firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

const EditDjProfile = () => {
  const router = useRouter();
  const { userId } = useContext(AuthContext);
  const [dj, setDj] = useState({});
  const [updateFields, setUpdateFields] = useState({
    username: "",
    city: "",
    price: "",
    description: ""
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
        const docRef = doc(db, "djs", userId);
        const data = await getDoc(docRef);
        if (data.exists()) {
          setDj(data.data());
          setUpdateFields(data.data());
        } else {
          console.log("DJ doesn't exist");
        }
      } catch (error) {
        console.log((error as Error).message);
      }
      setIsLoading(false); // Ensure loading state is updated after fetching data
    };

    getDjData();
  }, [userId]);

  const handleInputChange = (field, value) => {
    setUpdateFields((prev) => ({ ...prev, [field]: value }));
  };

  const updateDjProfile = async () => {
    try {
      const updatedData = {
        ...updateFields,
        price: updateFields.price ? parseFloat(updateFields.price) : undefined // Ensure price is a number
      };
      const updatedDj = await patchDj(userId, updatedData);
      setDj(updatedDj); // Update local DJ state if needed
      setUpdateMessage("Successfully Updated Profile");
      setGoBackIsVisible(true);
    } catch (err) {
      console.error(err.message);
      Alert.alert("Update Failed", err.message);
    }
  };

  // const resetPassword = async () => {
  //   const email = ""
  //   try {
  //     await sendPasswordResetEmail(auth, email);
  //     setUpdateMessage("Password reset email sent!");
  //   } catch (error) {
  //     Alert.alert("Error", error.message);
  //   }
  // };

  return (
    <ScrollView>
      <View style={styles.container}>
        <SafeAreaView />
        <Text style={styles.heading}>Edit Your Profile...</Text>
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
              value={updateFields[key].toString()}
              onChangeText={(value) => handleInputChange(key, value)}
              style={styles.input}
              underlineColorAndroid="transparent"
            />
          </View>
        ))}
        <TouchableOpacity style={styles.button} onPress={updateDjProfile}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        {/* Uncomment to enable password reset */}
        {/* <TouchableOpacity style={styles.button} onPress={resetPassword}>
          <Text style={styles.passwordText}>Reset Password</Text>
        </TouchableOpacity> */}
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
    // height: 80,
    marginLeft: 10,
    marginRight: 10,
    // marginTop: 100,
  },
  input: {
    height: 48,
    border: 2,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
    fontSize: 20,
  },
  inputMultiline: {
    height: "auto",
    border: 2,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
    fontSize: 20,
  },
  inputContainer: {
    flex: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: 50,
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
  buttonPassword: {
    height: 47,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    margin: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  passwordText: {
    fontSize: 20,
  },
  multilineText: {
    minHeight: 100,
  },
  messageText: {
    marginBottom: 10,
  },
});
