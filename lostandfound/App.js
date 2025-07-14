// App.js
import { NavigationContainer, useNavigation, useNavigationState } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Provider, useSelector } from "react-redux";
import { store } from "./src/store";
import { CartProvider } from "./src/hooks/CartContext";
import { Image, TouchableOpacity } from "react-native";

// Screens
import LocationScreen from "./src/screens/LocationScreen";
import PetDetailScreen from "./src/screens/PetDetailScreen";
import LoginScreen from "./src/screens/LoginScreen";
import NewAccountScreen from "./src/screens/NewAccountScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import UserProfileForm from "./src/screens/UserProfileFormScreen";
import AddPetScreen from "./src/screens/AddPetScreen";
import MyPetsScreen from "./src/screens/MyPetsScreen";
import HomeScreen from "./src/screens/HomeScreen";
import PetShopScreen from "./src/screens/PetShopScreen";
import LocationPetShopsScreen from "./src/screens/LocationPetShopsScreen";
import CartScreen from "./src/screens/CartScreen";
import ContinueShopping from "./src/screens/ContinueShopping";
import MercadoPagoScreen from "./src/screens/MercadoPagoScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// STACK INTERNO DE PERFIL
function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#DEE2D9" },
        headerTintColor: "#000000",
        contentStyle: { backgroundColor: "#fbfaf4" },
      }}
    >
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={UserProfileForm}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// DRAWER PRINCIPAL CON VISIBILIDAD CONDICIONAL
function DrawerNavigator() {
  const { authUser, profile } = useSelector((state) => state.auth);
  const navigation = useNavigation();
  const currentRoute = useNavigationState((state) => {
    const route = state.routes[state.index];

    // si estamos dentro de un stack, mirar su subruta activa
    if (route.state?.routes) {
      const nested = route.state.routes[route.state.index];
      return nested.name;
    }

    return route.name;
  });

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#DEE2D9" },
        headerTintColor: "#000000",
        drawerActiveTintColor: "#8DA290",
        drawerInactiveTintColor: "#000000",
        drawerStyle: { backgroundColor: "#FCF1D8" },
        drawerLabelStyle: { fontSize: 16, color: "#000000" },
        // 👉 Ocultar imagen en ProfileScreen o EditProfile
        headerRight: () =>
          authUser &&
          profile?.photoBase64 &&
          currentRoute !== "ProfileScreen" &&
          currentRoute !== "Perfil" &&
          currentRoute !== "EditProfile" ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("Perfil")}
              style={{ marginRight: 10 }}
            >
              <Image
                source={{ uri: profile.photoBase64 }}
                style={{ width: 35, height: 35, borderRadius: 17.5 }}
              />
            </TouchableOpacity>
          ) : null,
      }}
    >
      {/* Siempre visibles */}
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
      {/* <Drawer.Screen
        name="PetShop Cercanos"
        component={LocationPetShopsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
        }}
      /> */}

      {/* Solo si está logueado */}
      {authUser && (
        <>
          <Drawer.Screen
            name="Mis Mascotas"
            component={MyPetsScreen}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="paw-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="PetShop Online"
            component={PetShopScreen}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="cart" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Perfil"
            component={ProfileStackNavigator}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
            }}
          />
        </>
      )}

      {/* Solo si NO está logueado */}
      {!authUser && (
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
    <Provider store={store}>
      <CartProvider>
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
              }}
            />
            <Stack.Screen
              name="NewAccountScreen"
              component={NewAccountScreen}
              options={{
                headerShown: true,
                title: "Nuevo Usuario",
                headerStyle: { backgroundColor: "#DEE2D9" },
                headerTintColor: "#000000",
              }}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{
                headerShown: true,
                title: "Carrito",
                headerStyle: { backgroundColor: "#DEE2D9" },
                headerTintColor: "#000000",
              }}
            />
            <Stack.Screen
              name="ContinueShopping"
              component={ContinueShopping}
              options={{
                headerShown: true,
                title: "Continuar compra",
                headerStyle: { backgroundColor: "#DEE2D9" },
                headerTintColor: "#000000",
              }}
            />
            <Stack.Screen
              name="MercadoPagoScreen"
              component={MercadoPagoScreen}
              options={{
                headerShown: true,
                title: "Mercado Pago",
                headerStyle: { backgroundColor: "#009EE3" },
                headerTintColor: "#FFFFFF",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </Provider>
  );
}
