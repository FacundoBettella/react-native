// import * as Location from "expo-location";
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,  
} from "expo-location";
import { useState } from "react";

const useLocation = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);

  const getUserLocation = async () => {
    try {
      const { status } = await requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permiso a la ubicación fue RECHAZADO");
        return false;
      }

      const location = await getCurrentPositionAsync({
        // accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      console.log("latitude:", latitude, "longitude:", longitude);
      
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
