import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/fb";
import { useNavigation } from "@react-navigation/native";

export default function UserProfileForm() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const profileRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(profileRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setSurname(data.surname || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
          setImageBase64(data.photoBase64 || null);
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images],
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setImageBase64(`data:image/jpeg;base64,${selectedAsset.base64}`);
    }
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "No hay un usuario autenticado.");
        return;
      }

      const profileRef = doc(db, "users", user.uid);

      await setDoc(profileRef, {
        name,
        surname,
        phone,
        address,
        photoBase64: imageBase64 || null,
        email: user.email,
      });

      Alert.alert(
        "Perfil guardado",
        "Tu perfil se ha guardado correctamente.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      Alert.alert("Error", "No se pudo guardar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <ScrollView contentContainerStyle={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Apellido"
        value={surname}
        onChangeText={setSurname}
        style={styles.input}
      />
      <TextInput
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Dirección"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      <Button title="Seleccionar foto de perfil" onPress={pickImage} />
      {imageBase64 && (
        <Image source={{ uri: imageBase64 }} style={styles.image} />
      )}

      <Button
        title={loading ? "Guardando..." : "Guardar perfil"}
        onPress={saveProfile}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "stretch",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 12,
    alignSelf: "center",
  },
});
