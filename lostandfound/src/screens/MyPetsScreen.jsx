import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../config/fb";

const MyPetsScreen = () => {
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchMyPets = async () => {
      if (!currentUser?.uid) return;

      try {
        const q = query(
          collection(db, "pets"),
          where("userId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const myPets = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPets(myPets);
      } catch (error) {
        console.error("Error al cargar tus mascotas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPets();
  }, [currentUser]);

  const renderItem = ({ item }) => {
    const bgColor = item.status === "perdido" ? "#E6F0FF" : "#F0E6FF";
    const borderColor = item.status === "perdido" ? "#007FFF" : "#A040FB";
    const textColor = item.status === "perdido" ? "#007FFF" : "#A040FB";

    return (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: bgColor, borderLeftColor: borderColor },
        ]}
        onPress={() => navigation.navigate("PetDetail", { pet: item })}
      >
        <Image source={{ uri: item.image?.uri }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.type}>{item.type}</Text>
          <Text style={[styles.status, { color: textColor }]}>
            {item.status === "perdido" ? "Perdido" : "Encontrado"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#555" }}>
          Cargando tus publicaciones...
        </Text>
      </View>
    );
  }

  if (pets.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={{ fontSize: 16, color: "#777" }}>
          No has publicado mascotas aún.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default MyPetsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  card: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    justifyContent: "center",
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  type: {
    fontSize: 13,
    color: "#555",
  },
  status: {
    marginTop: 4,
    fontWeight: "600",
    fontSize: 13,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
