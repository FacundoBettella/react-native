import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LocationScreen from "./src/screens/LocationScreen";
import GalleryScreen from "./src/screens/GalleryScreen";

const Drawer = createDrawerNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Ionicons name="home-outline" size={60} color="#2f95dc" />
      <Text style={{ fontSize: 24, marginTop: 10 }}>
        Bienvenido a Lost & Found
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#2f95dc" },
          headerTintColor: "#fff",
          drawerActiveTintColor: "#2f95dc",
          drawerLabelStyle: { fontSize: 16 },
        }}
      >
        <Drawer.Screen
          name="Inicio"
          component={HomeScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Mapa"
          component={LocationScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="location-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Galería"
          component={GalleryScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="images-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
