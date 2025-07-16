import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../hooks/CartContext";

const ContinueShopping = () => {
  const navigation = useNavigation();
  const { cart } = useCart();

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);

  const cartItems = Object.values(cart).filter((item) => item.quantity > 0);

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const renderRadio = (selected) => (
    <View style={styles.radioCircle}>
      {selected && <View style={styles.selectedRb} />}
    </View>
  );

  const canContinue = selectedPayment && selectedShipping;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
          <Text style={styles.heading}>Ya casi completas la compra...</Text>
          <Image
            source={require("../../assets/shoppingTime.png")}
            style={styles.headerImage}
          />

          <Text style={styles.title}>Total de productos</Text>
          <Text style={styles.total}>${getTotalPrice()}</Text>

          <Text style={styles.sectionTitle}>Medios de pago:</Text>
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedPayment === "mercadopago" && styles.optionButtonSelected,
            ]}
            onPress={() => setSelectedPayment("mercadopago")}
          >
            <View style={styles.radioWithImage}>
              {renderRadio(selectedPayment === "mercadopago")}
              <Image
                source={require("../../assets/mercadopago.png")}
                style={styles.mercadoPagoImage}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.andreaniTitleContainer}>
            <Text style={styles.sectionTitle}>Envío por Andreani</Text>
            <Image
              source={require("../../assets/andreani.png")}
              style={styles.andreaniLogo}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedShipping === "andreani-comun" &&
                styles.optionButtonSelected,
            ]}
            onPress={() => setSelectedShipping("andreani-comun")}
          >
            {renderRadio(selectedShipping === "andreani-comun")}
            <Text style={styles.optionText}>Andreani común - $2500</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedShipping === "andreani-prioritario" &&
                styles.optionButtonSelected,
            ]}
            onPress={() => setSelectedShipping("andreani-prioritario")}
          >
            {renderRadio(selectedShipping === "andreani-prioritario")}
            <Text style={styles.optionText}>Andreani prioritario - $4000</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: canContinue ? "#4CAF50" : "#ccc",
            },
          ]}
          onPress={() => {
            if (canContinue) {
              navigation.navigate("MercadoPagoScreen");
            }
          }}
          disabled={!canContinue}
        >
          <Text style={styles.buttonText}>Completar Compra</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f1",
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  headerImage: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
    color: "#333",
  },
  total: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#4CAF50",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  optionButtonSelected: {
    backgroundColor: "#d4edda",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  radioWithImage: {
    flexDirection: "row",
    alignItems: "center",
  },
  mercadoPagoImage: {
    width: 120,
    height: 40,
    resizeMode: "contain",
    marginLeft: 12,
  },
  andreaniTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    marginBottom: 6,
  },
  andreaniLogo: {
    width: 80,
    height: 25,
    resizeMode: "contain",
    marginLeft: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ContinueShopping;
