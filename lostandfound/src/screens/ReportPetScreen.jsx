import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../config/firebase";

export default function ReportPetScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Campos del reporte
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const profileRef = doc(db, "users", user.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        setProfile(profileSnap.data());
      }
    };

    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permisos", "Se necesita acceso a la ubicación para reportar.");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        // Obtener dirección aproximada
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const addr = reverseGeocode[0];
          setAddress(`${addr.street || ""} ${addr.streetNumber || ""}, ${addr.city || ""}`);
        }
      } catch (error) {
        console.error("Error obteniendo ubicación:", error);
      }
    };

    fetchUserProfile();
    getCurrentLocation();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setImage(`data:image/jpeg;base64,${selectedAsset.base64}`);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permisos", "Se necesita acceso a la cámara para tomar fotos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setImage(`data:image/jpeg;base64,${selectedAsset.base64}`);
    }
  };

  const handleSubmitReport = async () => {
    if (!profile) {
      Alert.alert("Error", "No se pudo obtener la información del usuario.");
      return;
    }

    // Validaciones
    if (!description.trim()) {
      Alert.alert("Falta información", "Por favor describe lo que encontraste.");
      return;
    }

    if (!image) {
      Alert.alert("Falta foto", "Por favor toma una foto de la mascota encontrada.");
      return;
    }

    if (!location.latitude || !location.longitude) {
      Alert.alert("Ubicación", "No se pudo obtener la ubicación actual.");
      return;
    }

    setLoading(true);

    const reportData = {
      type: "possible_finding",
      latitude: location.latitude,
      longitude: location.longitude,
      description,
      address: address || "Ubicación no disponible",
      image: { uri: image },
      phone: profile.phone,
      owner: `${profile.name} ${profile.surname}`,
      userId: auth.currentUser.uid,
      status: "encontrado", // Estado por defecto para hallazgos
      date: new Date().toLocaleDateString("es-AR"),
      createdAt: serverTimestamp(),
      // Campos adicionales para mantener consistencia
      name: "Mascota encontrada",
      breed: "Desconocida",
      gender: "Desconocido",
      age: "Desconocido",
      retained: false,
    };

    try {
      await addDoc(collection(db, "pets"), reportData);
      Alert.alert(
        "Reporte enviado",
        "Gracias por reportar este hallazgo. La comunidad podrá ver tu reporte en el mapa.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      Alert.alert("Error", "No se pudo enviar el reporte. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Reportar Hallazgo</Text>
        <Text style={styles.subtitle}>
          ¿Encontraste una mascota? Ayuda a reunirla con su familia
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Descripción de la mascota *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe la mascota: raza, color, tamaño, comportamiento, etc."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Ubicación donde la encontraste</Text>
        <TextInput
          style={styles.input}
          placeholder="Dirección o referencia del lugar"
          value={address}
          onChangeText={setAddress}
        />
        <Text style={styles.locationInfo}>
          📍 Ubicación automática: {location.latitude ? "✓ Obtenida" : "⏳ Obteniendo..."}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Foto de la mascota *</Text>
        
        <View style={styles.imageButtons}>
          <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
            <Text style={styles.imageButtonText}>📷 Tomar Foto</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>🖼️ Desde Galería</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImage(null)}
            >
              <Text style={styles.removeImageText}>❌ Quitar foto</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleSubmitReport}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Enviar Reporte</Text>
        )}
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Tu reporte aparecerá en el mapa para que otros usuarios puedan verlo.
          Incluye toda la información posible para facilitar la identificación.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF1D8",
    padding: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  locationInfo: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  imageButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    backgroundColor: "#8DA290",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  imagePreview: {
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  removeImageButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  removeImageText: {
    color: "#fff",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  infoBox: {
    backgroundColor: "#E8F4FD",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});