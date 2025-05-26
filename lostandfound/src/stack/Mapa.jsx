import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LocationScreen from "../screens/LocationScreen";
import PetDetailScreen from "../screens/PetDetailScreen";

const Stack = createNativeStackNavigator();

export function MapStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Location"
        component={LocationScreen}
        options={{ title: "Mapa de mascotas" }}
      />
      <Stack.Screen
        name="PetDetail"
        component={PetDetailScreen}
        options={{ title: "Detalle de mascota" }}
      />
    </Stack.Navigator>
  );
}
