import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../hooks/CartContext";

const products = [
  {
    id: "1",
    name: "Alimento Premium",
    price: 8500,
    image: require("../../assets/products/alimento.jpg"),
  },
  {
    id: "2",
    name: "Pelota de Goma",
    price: 2000,
    image: require("../../assets/products/pelota.jpg"),
  },
  {
    id: "3",
    name: "Cama Mediana",
    price: 15000,
    image: require("../../assets/products/cama.jpg"),
  },
  {
    id: "4",
    name: "Rascador Gato",
    price: 12800,
    image: require("../../assets/products/rascador.jpg"),
  },
  {
    id: "5",
    name: "Collar Reflectante",
    price: 3500,
    image: require("../../assets/products/collar.jpg"),
  },
  {
    id: "6",
    name: "Shampoo Natural",
    price: 4300,
    image: require("../../assets/products/shampoo.jpg"),
  },
];

const PetShopScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cart, addToCart, getTotalItems, clearCart } = useCart();

  const [showThanksModal, setShowThanksModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.showThanksModal) {
        setShowThanksModal(true);
      }
    }, [route.params])
  );

  const closeThanksModal = () => {
    setShowThanksModal(false);
    clearCart();
    navigation.setParams({ showThanksModal: false });
  };

  const renderItem = ({ item }) => {
    const quantity = cart[item.id]?.quantity || 0;
    return (
      <View style={styles.card}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
        {quantity > 0 && <Text style={styles.counter}>Cantidad: {quantity}</Text>}
        <TouchableOpacity style={styles.button} onPress={() => addToCart(item)}>
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PetShop</Text>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.cartIcon}
        onPress={() => navigation.navigate("Cart")}
      >
        <Ionicons name="cart" size={30} color="white" />
        {getTotalItems() > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Modal personalizado */}
      <Modal
        visible={showThanksModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeThanksModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Gracias por su compra</Text>
            <Text style={styles.modalMessage}>
              En unos momentos recibirá un mail con los datos del envío.
            </Text>
            <Pressable style={styles.modalButton} onPress={closeThanksModal}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f1",
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    alignSelf: "center",
    color: "#333",
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    margin: 8,
    flex: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  counter: {
    fontSize: 12,
    color: "#444",
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#8DA290",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cartIcon: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#d8693f",
    borderRadius: 32,
    padding: 12,
    elevation: 4,
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  cartBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // fondo negro semitransparente
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 30,
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  modalMessage: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#8DA290",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default PetShopScreen;
