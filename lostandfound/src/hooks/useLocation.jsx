import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import { useState } from "react";

const useLocation = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  const getUserLocation = async () => {
    try {
      const { status } = await requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permiso a la ubicación fue RECHAZADO");
        return false;
      }

      const location = await getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setLatitude(latitude);
      setLongitude(longitude);

      return true;
    } catch (error) {
      setErrorMsg("Error obteniendo la ubicación");
      return false;
    }
  };

  return { getUserLocation, latitude, longitude, errorMsg };
};

export default useLocation;
