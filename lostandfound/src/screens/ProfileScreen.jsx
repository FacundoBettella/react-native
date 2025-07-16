import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/thunks/authThunks";
import { clearPets } from "../store/slices/petsSlice";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { authUser, profile } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(logoutUser());
    dispatch(clearPets());
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás segura/o que querés cerrar sesión?",
      [
        { text: "No", style: "cancel" },
        { text: "Sí", onPress: logout },
      ],
      { cancelable: false }
    );
  };

  if (!authUser) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const userData = {
    name: profile?.name || "",
    surname: profile?.surname || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    photoBase64: profile?.photoBase64 || null,
    email: authUser?.email || "",
  };

  return (
    <View style={styles.container}>
      {userData.photoBase64 ? (
        <Image
          source={{ uri: userData.photoBase64 }}
          style={styles.profileImage}
        />
      ) : (
        <Image
          source={require("../../assets/default-avatar.jpg")}
          style={styles.profileImage}
        />
      )}
      <Text style={styles.text}>
        Nombre: {userData.name || "(sin nombre)"} {userData.surname || ""}
      </Text>
      <Text style={styles.text}>Email: {userData.email}</Text>
      <Text style={styles.text}>
        Teléfono: {userData.phone || "(sin teléfono)"}
      </Text>
      <Text style={styles.text}>
        Dirección: {userData.address || "(sin dirección)"}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.customButton, { backgroundColor: "#8DA290" }]}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.buttonText}>Editar perfil</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={[styles.customButton, { backgroundColor: "#8DA290" }]}
          onPress={() => navigation.navigate("Subscription")}
        >
          <Text style={styles.buttonText}>Suscripción</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={[styles.customButton, { backgroundColor: "#ff4d4d" }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fbfaf4",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: "#ddd",
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
    width: "100%",
  },
  customButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutContainer: {
    marginTop: "auto",
    width: "100%",
  },
});

export default ProfileScreen;
