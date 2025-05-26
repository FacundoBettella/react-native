import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import useLocation from "../hooks/useLocation";
import { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

const mockedCoords = [
  {
    latitude: -34.612945,
    longitude: -58.550872,
    name: "Luna",
    type: "Perro",
    breed: "Mestiza",
    gender: "Hembra",
    age: "Adulta",
    date: "15/05/2025",
    address: "Av. Rivadavia 9200, Villa Luro, CABA",
    retained: false,
    status: "perdido",
    owner: "Laura Pérez",
    phone: "+541112345678",
    image: { uri: "https://placedog.net/400?id=1" },
    description:
      "Luna es una perrita mestiza de tamaño mediano, muy amigable y juguetona. Se perdió el 15 de mayo en la zona de Villa Luro. Tiene un pelaje marrón claro con manchas blancas en el pecho. Llevaba un collar rojo con chapita. Es sociable y responde a su nombre. Puede tener miedo a los ruidos fuertes. Necesita medicación diaria. Si la ves, por favor no la persigas: llamá o mandá un mensaje. La familia está desesperada por encontrarla. ¡Gracias!",
  },
  {
    latitude: -34.600273,
    longitude: -58.562103,
    name: "Michi",
    type: "Gato",
    breed: "Doméstico",
    gender: "Macho",
    age: "Adulto",
    date: "20/05/2025",
    address: "Calle Alberdi 3000, Mataderos, CABA",
    retained: true,
    status: "encontrado",
    owner: "María Gómez",
    phone: "+541187654321",
    image: { uri: "https://placedog.net/400?id=2" },
    description:
      "Gato blanco con manchas negras, ojos verdes. Apareció en la puerta de casa. Está bien alimentado y parece acostumbrado a los humanos. Lo tenemos en casa esperando a que alguien lo reconozca.",
  },
  {
    latitude: -34.620198,
    longitude: -58.572347,
    name: "Estrella",
    type: "Perro",
    breed: "Labrador",
    gender: "Hembra",
    age: "Cachorra",
    date: "10/05/2025",
    address: "Av. Directorio 4400, Parque Avellaneda, CABA",
    retained: false,
    status: "perdido",
    owner: "Martín Ruiz",
    phone: "+541187654321",
    image: { uri: "https://placedog.net/400?id=3" },
    description:
      "Estrella es una cachorra labradora color dorado, muy dócil y juguetona. Se escapó del patio. No tenía collar. Agradecemos cualquier información.",
  },
  {
    latitude: -34.604389,
    longitude: -58.578914,
    name: "Sol",
    type: "Tortuga",
    breed: "Tortuga de tierra",
    gender: "Desconocido",
    age: "Adulta",
    date: "18/05/2025",
    address: "Pasaje Las Flores 1500, Liniers, CABA",
    retained: false,
    status: "perdido",
    owner: "Familia Molina",
    phone: "+541187654321",
    image: { uri: "https://placedog.net/400?id=4" },
    description:
      "Tortuga de tierra, tamaño mediano. Se perdió del jardín. Tiene una marca en el caparazón que la distingue. No suele alejarse mucho. Si la ves, avisá por favor.",
  },
  {
    latitude: -34.617845,
    longitude: -58.556731,
    name: "Mermelada",
    type: "Perro",
    breed: "Caniche",
    gender: "Macho",
    age: "Adulto",
    date: "22/05/2025",
    address: "Ramón Falcón 5000, Floresta, CABA",
    retained: true,
    status: "encontrado",
    owner: "Pedro López",
    phone: "+541187654321",
    image: { uri: "https://placedog.net/400?id=5" },
    description:
      "Pequeño caniche encontrado en la plaza. Estaba asustado y tenía el pelo muy prolijo. Lo tengo en casa por si alguien lo reconoce.",
  },
];

// const mockedCoords = [
//   {
//     latitude: -34.612945,
//     longitude: -58.550872,
//     name: "Luna",
//     type: "Perro",
//     status: "perdido",
//     image: { uri: "https://placedog.net/400?id=1" },
//     phone: "+541112345678",
//     description:
//       "Luna es una perrita mestiza de tamaño mediano, muy amigable y juguetona. Se perdió el 15 de mayo en la zona de Villa Luro. Tiene un pelaje marrón claro con manchas blancas en el pecho. Llevaba un collar rojo con chapita. Es sociable y responde a su nombre. Puede tener miedo a los ruidos fuertes. Necesita medicación diaria. Si la ves, por favor no la persigas: llamá o mandá un mensaje. La familia está desesperada por encontrarla. ¡Gracias!",
//   },
//   {
//     latitude: -34.600273,
//     longitude: -58.562103,
//     name: "Michi",
//     type: "Gato",
//     status: "encontrado",
//     image: { uri: "https://placedog.net/400?id=2" },
//     phone: "+54 11 8765 4321",
//     description: "Gato blanco con manchas negras. Ojos verdes.",
//   },
//   {
//     latitude: -34.620198,
//     longitude: -58.572347,
//     name: "Estrella",
//     type: "Perro",
//     status: "perdido",
//     image: { uri: "https://placedog.net/400?id=3" },
//     phone: "+54 11 8765 4321",
//     description: "Gato blanco con manchas negras. Ojos verdes.",
//   },
//   {
//     latitude: -34.604389,
//     longitude: -58.578914,
//     name: "Sol",
//     type: "Tortuga",
//     status: "perdido",
//     image: { uri: "https://placedog.net/400?id=4" },
//     phone: "+54 11 8765 4321",
//     description: "Gato blanco con manchas negras. Ojos verdes.",
//   },
//   {
//     latitude: -34.617845,
//     longitude: -58.556731,
//     name: "Mermelada",
//     type: "Perro",
//     status: "encontrado",
//     image: { uri: "https://placedog.net/400?id=5" },
//     phone: "+54 11 8765 4321",
//     description: "Gato blanco con manchas negras. Ojos verdes.",
//   },
// ];

const LocationScreen = () => {
  const { getUserLocation, latitude, longitude } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCoord, setSelectedCoord] = useState(null);
  const mapRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLocation = async () => {
      const success = await getUserLocation();
      if (success && mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 100,
            longitudeDelta: 100,
          },
          500
        );

        setTimeout(() => {
          mapRef.current.animateToRegion(
            {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            },
            1500
          );
          setIsLoading(false);
        }, 600);
      } else {
        setIsLoading(false);
      }
    };
    fetchLocation();
  }, [latitude, longitude]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10, fontSize: 16, color: "#555" }}>
            Obteniendo tu ubicación...
          </Text>
        </View>
      ) : (
        <>
          <MapView
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: 0,
              longitude: 0,
              latitudeDelta: 100,
              longitudeDelta: 100,
            }}
          >
            {latitude &&
              longitude &&
              mockedCoords.map((coord, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: coord.latitude,
                    longitude: coord.longitude,
                  }}
                  onPress={() => setSelectedCoord(coord)}
                >
                  <View
                    style={[
                      styles.markerWrapper,
                      {
                        backgroundColor:
                          coord.status === "perdido" ? "#007FFF" : "#A040FB",
                      },
                    ]}
                  >
                    <Text style={styles.markerIcon}>
                      {coord.type === "Perro"
                        ? "🐶"
                        : coord.type === "Gato"
                        ? "🐱"
                        : "🐢"}
                    </Text>
                  </View>
                </Marker>
              ))}
          </MapView>

          {/* {selectedCoord && (
            <View style={styles.customCallout}>
              <Image source={selectedCoord.image} style={styles.calloutImage} />
              <View style={styles.calloutTextContainer}>
                <Text style={styles.calloutName}>{selectedCoord.name}</Text>
                <Text style={styles.calloutType}>{selectedCoord.type}</Text>
                <Text
                  style={[
                    styles.calloutStatus,
                    {
                      color:
                        selectedCoord.status === "perdido"
                          ? "#007FFF"
                          : "#A040FB",
                    },
                  ]}
                >
                  {selectedCoord.status === "perdido"
                    ? "Perdido"
                    : "Encontrado"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedCoord(null)}
                style={styles.closeButton}
              >
                <Text style={{ fontSize: 18, color: "#aaa" }}>✕</Text>
              </TouchableOpacity>
            </View>
          )} */}
          {selectedCoord && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.customCallout}
              onPress={() => {
                navigation.navigate("PetDetail", { pet: selectedCoord });
                setSelectedCoord(null);
              }}
            >
              <Image source={selectedCoord.image} style={styles.calloutImage} />
              <View style={styles.calloutTextContainer}>
                <Text style={styles.calloutName}>{selectedCoord.name}</Text>
                <Text style={styles.calloutType}>{selectedCoord.type}</Text>
                <Text
                  style={[
                    styles.calloutStatus,
                    {
                      color:
                        selectedCoord.status === "perdido"
                          ? "#007FFF"
                          : "#A040FB",
                    },
                  ]}
                >
                  {selectedCoord.status === "perdido"
                    ? "Perdido"
                    : "Encontrado"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation(); // <- esto evita que el evento se propague al TouchableOpacity exterior
                  setSelectedCoord(null);
                }}
                style={styles.closeButton}
              >
                <Text style={{ fontSize: 18, color: "#aaa" }}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  customCallout: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 8,
    padding: 4,
  },
  calloutImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  calloutTextContainer: {
    justifyContent: "center",
    flex: 1,
  },
  calloutName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  calloutType: {
    fontSize: 12,
    color: "#555",
  },
  calloutStatus: {
    marginTop: 4,
    fontWeight: "600",
  },
  markerWrapper: {
    padding: 6,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  markerIcon: {
    fontSize: 20,
  },
});
