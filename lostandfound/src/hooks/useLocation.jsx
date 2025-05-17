import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
  reverseGeocodeAsync,
} from "expo-location";
import { useEffect, useState } from "react";

const useLocation = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [locationDetails, setlocationDetails] = useState("");

  const getUserLocation = async () => {
    let { status } = await requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setErrorMsg("Permiso a la ubicación fue RECHAZADO");
      return;
    }

    let { coords } = await getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;
      console.log("Lat y Long son: ", latitude, longitude);
      setLatitude(latitude);
      setLongitude(longitude);
      let response = await reverseGeocodeAsync({
        latitude,
        longitude,
      });
      console.log("La ubicación del usuario es: ", response);
      setlocationDetails(response[0]);
    }
  };

  //   useEffect(() => {
  //     getUserLocation();
  //   }, []);

  return { getUserLocation, latitude, longitude, errorMsg, locationDetails };
};

export default useLocation;
