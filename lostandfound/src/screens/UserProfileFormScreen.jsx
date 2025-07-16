import { useState, useEffect } from "react";
import {
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../store/thunks/authThunks";

export default function UserProfileForm() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setSurname(profile.surname || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
      setImageBase64(profile.photoBase64 || null);
    }
    setInitialLoading(false);
  }, [profile]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setImageBase64(`data:image/jpeg;base64,${selectedAsset.base64}`);
    }
  };

  const saveProfile = async () => {
    setLoading(true);

    const result = await dispatch(
      updateUserProfile({
        name,
        surname,
        phone,
        address,
        photoBase64: imageBase64 || null,
      })
    );

    setLoading(false);

    if (result.success) {
      Alert.alert(
        "Perfil guardado",
        "Tu perfil se ha guardado correctamente.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert("Error", "No se pudo guardar el perfil.");
    }
  };

  const cancelEdit = () => navigation.goBack();

  if (initialLoading) {
    return (
      <ScrollView contentContainerStyle={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
    >
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

      {imageBase64 ? (
        <>
          <Image source={{ uri: imageBase64 }} style={styles.image} />
          <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Cambiar imagen de perfil</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Cargar imagen de perfil</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={cancelEdit} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={saveProfile}
        disabled={loading}
        style={[styles.saveButton, loading && { opacity: 0.6 }]}
      >
        <Text style={styles.saveButtonText}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "stretch",
    backgroundColor: "#fbfaf4",
    flexGrow: 1,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fbfaf4",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 12,
    alignSelf: "center",
  },
  imageButton: {
    backgroundColor: "#8DA290",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  imageButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#8DA290",
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
    alignSelf: "center",
    width: "60%",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  cancelButton: {
    marginTop: 150,
    alignSelf: "center",
  },
  cancelButtonText: {
    color: "#8DA290",
    fontWeight: "bold",
  },
});
