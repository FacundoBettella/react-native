import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./AuthProvider";

// Screens
import LocationScreen from "./src/screens/LocationScreen";
import PetDetailScreen from "./src/screens/PetDetailScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import UserProfileForm from "./src/screens/UserProfileFormScreen";
import AddPetScreen from "./src/screens/AddPetScreen";
import MyPetsScreen from "./src/screens/MyPetsScreen";
import HomeScreen from "./src/screens/HomeScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// STACK INTERNO DE PERFIL
function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#DEE2D9" }, 
        headerTintColor: "#000000", 
        contentStyle: { backgroundColor: "#FCF1D8" }, 
      }}
    >
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
          title: "Mi Perfil",
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={UserProfileForm}
        options={{
          headerShown: false,
          title: "Editar Perfil",
        }}
      />
    </Stack.Navigator>
  );
}

// DRAWER PRINCIPAL
function DrawerNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#DEE2D9" }, 
        headerTintColor: "#000000", 
        drawerActiveTintColor: "#8DA290", 
        drawerInactiveTintColor: "#000000", 
        drawerStyle: {
          backgroundColor: "#FCF1D8", 
        },
        drawerLabelStyle: { fontSize: 16, color: "#000000" },
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
      {user && (
        <Drawer.Screen
          name="Mis Mascotas"
          component={MyPetsScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="paw-outline" size={size} color={color} />
            ),
          }}
        />
      )}
      {user ? (
        <Drawer.Screen
          name="Perfil"
          component={ProfileStackNavigator}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      ) : (
        <Drawer.Screen
          name="Login"
          component={LoginScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="log-in-outline" size={size} color={color} />
            ),
          }}
        />
      )}
    </Drawer.Navigator>
  );
}

// APP ROOT
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#FCF1D8" }, 
          }}
        >
          <Stack.Screen name="Main" component={DrawerNavigator} />
          <Stack.Screen
            name="PetDetail"
            component={PetDetailScreen}
            options={{
              headerShown: true,
              title: "Detalle de mascota",
              headerStyle: { backgroundColor: "#DEE2D9" }, 
              headerTintColor: "#000000", 
              contentStyle: { backgroundColor: "#FCF1D8" }, 
            }}
          />
          <Stack.Screen
            name="AddPet"
            component={AddPetScreen}
            options={{
              headerShown: true,
              title: "Agregar o editar mascota",
              headerStyle: { backgroundColor: "#DEE2D9" }, 
              headerTintColor: "#000000", 
              contentStyle: { backgroundColor: "#FCF1D8" }, 
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: true,
              title: "Iniciar sesión",
              headerStyle: { backgroundColor: "#DEE2D9" }, 
              headerTintColor: "#000000", 
              contentStyle: { backgroundColor: "#FCF1D8" }, 
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
