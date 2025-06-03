import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../config/fb";
import { useNavigation } from "@react-navigation/native";

const PetDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { pet } = route.params;
  const currentUser = auth.currentUser;
  const isOwner = currentUser && pet.userId === currentUser.uid;

  const openWhatsApp = () => {
    const message = `Hola, vi tu publicación sobre ${pet.name}. ¿Sigue disponible la información?`;
    const url = `https://wa.me/${pet.phone.replace(
      /\D/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pet.latitude},${pet.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: pet.status === "perdido" ? "#F0F8FF" : "#F8F0FF",
        },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={pet.image} style={styles.image} />

        <Text style={styles.name}>{pet.name}</Text>

        <View
          style={[
            styles.badgeContainer,
            {
              backgroundColor: pet.status === "perdido" ? "#E0F0FF" : "#F2E6FF",
            },
          ]}
        >
          <Text style={styles.badgeText}>
            {pet.type} •{" "}
            <Text style={{ fontWeight: "bold" }}>
              {pet.status === "perdido" ? "Perdido" : "Encontrado"}
            </Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Descripción:</Text>
          <Text style={styles.description}>{pet.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Información adicional:</Text>
          <Text style={styles.infoText}>📍 Dirección: {pet.address}</Text>
          <Text style={styles.infoText}>📆 Fecha: {pet.date}</Text>
          <Text style={styles.infoText}>🐾 Raza: {pet.breed}</Text>
          <Text style={styles.infoText}>⚧️ Género: {pet.gender}</Text>
          <Text style={styles.infoText}>🎂 Edad: {pet.age}</Text>
          {pet.status === "encontrado" && pet.retained && (
            <Text style={styles.infoText}>
              🏠 Está retenido en un domicilio
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            {pet.status === "perdido"
              ? `Dueño/a: ${pet.owner}`
              : `Encontrado por: ${pet.owner}`}
          </Text>
          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={openWhatsApp}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#fff" />
            <Text style={styles.whatsappText}>Enviar mensaje por WhatsApp</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapContainer}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={openGoogleMaps}
            activeOpacity={0.9}
          >
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: pet.latitude,
                longitude: pet.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              pointerEvents="none"
            >
              <Marker
                coordinate={{
                  latitude: pet.latitude,
                  longitude: pet.longitude,
                }}
              />
            </MapView>
          </TouchableOpacity>
        </View>

        {isOwner && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("AddPet", { pet, isEditing: true })
            }
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.editButtonText}>Editar publicación</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default PetDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  badgeContainer: {
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 16,
    color: "#333",
  },
  section: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  infoText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 4,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  whatsappText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "600",
  },
  mapContainer: {
    marginTop: 20,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 30,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  editButton: {
    backgroundColor: "#6C63FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 30,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
});
