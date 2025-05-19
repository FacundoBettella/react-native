import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

const GalleryScreen = () => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Expo Image Picker</Text>

      <View style={styles.previewContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>No image selected</Text>
        )}
      </View>

      {!image && (
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <Text style={styles.buttonText}>Pick Media</Text>
          </TouchableOpacity>
        </View>
      )}
      {image && (
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <Text style={styles.buttonText}>Remove Media</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default GalleryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 400,
    marginHorizontal: "auto",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  previewContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    marginHorizontal: 16,
  },
  placeholderText: {
    color: "#6b7280",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  galleryButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  removeButton: {
    flex: 1,
    backgroundColor: "red",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
});
