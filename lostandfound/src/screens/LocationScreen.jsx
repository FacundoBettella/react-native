import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import useLocation from "../hooks/useLocation";
import { useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";

const LocationScreen = () => {
  const { getUserLocation, latitude, longitude, errorMsg, locationDetails } =
    useLocation();
  const [hasFetched, setHasFetched] = useState(false);
  const [mapRegion] = useState({
    latitude: -34.603722, // Ej: Buenos Aires
    longitude: -58.381592,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const mapRef = useRef(null);

  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000 // duración en milisegundos
      );
    }
  }, [latitude, longitude]);

  const handleGetLocation = () => {
    if (hasFetched) return;
    getUserLocation();
    setHasFetched(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.iconWrapper}>
          <Feather name="map-pin" size={70} color="#a1a1a1" />
        </View>

        <Text style={styles.title}>
          {`Usar expo-location & \n`}
          {`react-native-maps`}
        </Text>

        <MapView ref={mapRef} style={styles.map} initialRegion={mapRegion}>
          {latitude && longitude && (
            <Marker coordinate={{ latitude, longitude }} title="Tu ubicación" />
          )}
        </MapView>

        <Text style={styles.desc}>
          Cuando hagas click en el boton, se obtendra la ubicación de tu
          dispositivo
        </Text>

        <TouchableOpacity
          style={[styles.btn, hasFetched && styles.btnDisabled]}
          onPress={handleGetLocation}
          disabled={hasFetched}
        >
          <Text style={styles.btnText}>
            {hasFetched ? "Ubicación obtenida" : "Obtener ubicación"}
          </Text>
        </TouchableOpacity>

        {latitude && longitude && (
          <Text style={styles.locationText}>
            Latitud: {latitude.toFixed(6)}
            {"\n"}
            Longitud: {longitude.toFixed(6)}
          </Text>
        )}

        {locationDetails && (
          <Text style={styles.locationText}>
            {locationDetails.name && `Dirección: ${locationDetails.name}\n`}
            {locationDetails.city && `Ciudad: ${locationDetails.city}\n`}
            {locationDetails.region && `Región: ${locationDetails.region}\n`}
            {locationDetails.country && `País: ${locationDetails.country}`}
          </Text>
        )}

        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      </ScrollView>
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  scrollContainer: {
    alignItems: "center",
    paddingHorizontal: 25,
    paddingBottom: 50,
  },
  iconWrapper: {
    backgroundColor: "#f2f2f2",
    padding: 40,
    borderRadius: "100%",
    borderWidth: 1,
    borderColor: "#e6e6e6",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: "#1a1a1a",
    marginBottom: 10,
  },
  desc: {
    textAlign: "center",
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: "10%",
  },
  btnText: {
    fontSize: 20,
    color: "white",
  },
  locationText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "red",
  },
  btnDisabled: {
    backgroundColor: "gray",
  },
  locationText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  // map: {
  //   marginTop: 20,
  //   width: Dimensions.get("window").width - 50,
  //   height: 200,
  //   borderRadius: 10,
  // },
  map: {
    width: Dimensions.get("window").width - 50,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
});
