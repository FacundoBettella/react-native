import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { auth, db } from "../config/fb";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const logout = () => auth.signOut();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const baseData = {
          name: "",
          surname: "",
          phone: "",
          address: "",
          photoBase64: "",
          email: currentUser.email || "",
        };

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData({ ...baseData, ...docSnap.data() });
        } else {
          setUserData(baseData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
        <Button
          title="Editar perfil"
          onPress={() => navigation.navigate("EditProfile")}
        />
        <Button title="Cerrar sesión" color="red" onPress={logout} />
        <Button
          title="Agregar Mascota"
          onPress={() => navigation.navigate("AddPet")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
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
    gap: 10,
    width: "100%",
  },
});

export default ProfileScreen;
