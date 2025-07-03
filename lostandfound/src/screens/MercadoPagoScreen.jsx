import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useCart } from "../hooks/CartContext";

const MercadoPagoScreen = () => {
  const navigation = useNavigation();
  const { cart } = useCart();
  const { profile } = useSelector((state) => state.auth);

  const [cvv, setCvv] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const cartItems = Object.values(cart).filter((item) => item.quantity > 0);
  const totalProductos = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const envio = 2500;
  const totalFinal = totalProductos + envio;
  const fullName = `${profile?.name || ""} ${profile?.surname || ""}`.trim();

  const handleCvvChange = (text) => {
    const filtered = text.replace(/[^0-9]/g, "");
    if (filtered.length <= 3) {
      setCvv(filtered);
    }
  };

  const handlePagar = () => {
    if (cvv.length !== 3) {
      alert(
        "Por favor ingresa un código de seguridad (CVV) válido de 3 dígitos."
      );
      return;
    }

    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymentDone(true);
      setTimeout(() => {
        navigation.navigate("Main", {
          screen: "PetShop Online",
          params: { showThanksModal: true },
        });
      }, 5000);
    }, 1500);
  };

  if (isPaying) {
    return (
      <View style={styles.processingContainer}>
        <Text style={styles.processingText}>Procesando pago...</Text>
      </View>
    );
  }

  if (paymentDone) {
    return (
      <View style={styles.successWrapper}>
        <View style={styles.successHeader}>
          <Text style={styles.successIcon}>🛍️</Text>
          <Text style={styles.successTitle}>Compra exitosa</Text>
        </View>

        <View style={styles.successCard}>
          <Text style={styles.successQuestion}>¿Qué puedo hacer?</Text>
          <Text style={styles.successSuggestion}>
            Tu pago fue confirmado correctamente.
          </Text>

          <TouchableOpacity
            style={styles.successButton}
            onPress={() =>
              navigation.navigate("Main", {
                screen: "PetShop Online",
                params: { showThanksModal: true },
              })
            }
          >
            <Text style={styles.successButtonText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: null })}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Para terminar, confirmá tu pago</Text>
        <Text style={styles.userName}>{fullName || "(Sin nombre)"}</Text>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Detalle de tu compra</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Productos (con envío)</Text>
          <Text style={styles.value}>${totalFinal.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelBold}>Pagás</Text>
          <Text style={styles.valueBold}>${totalFinal.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.cardLeft}>
          <View style={styles.cardIconCircle}>
            <Text style={styles.cardIconText}>💳</Text>
          </View>
          <View>
            <Text style={styles.cardText}>Mastercard ****1234</Text>
            <Text style={styles.cardSubText}>Banco BBVA</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => console.log("Modificar tarjeta")}>
          <Text style={styles.modifyText}>Modificar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cvvSection}>
        <Text style={styles.cvvLabel}>Código de seguridad</Text>
        <TextInput
          value={cvv}
          onChangeText={handleCvvChange}
          keyboardType="numeric"
          maxLength={3}
          style={styles.cvvInput}
          placeholder="Últimos 3 números en el dorso"
          secureTextEntry={true}
          textContentType="creditCardSecurityCode"
        />
      </View>

      <TouchableOpacity
        style={[
          styles.payButton,
          { backgroundColor: cvv.length === 3 ? "#007bff" : "#9bbbe5" },
        ]}
        onPress={handlePagar}
        disabled={cvv.length !== 3}
      >
        <Text style={styles.payButtonText}>Pagar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6f9",
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
    color: "#212121",
  },
  userName: {
    fontWeight: "500",
    fontSize: 18,
    color: "#212121",
  },
  summaryBox: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  summaryTitle: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 12,
    color: "#212121",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#616161",
  },
  labelBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#212121",
  },
  value: {
    fontSize: 14,
    color: "#212121",
  },
  valueBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#212121",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    marginBottom: 20,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cardIconText: {
    fontSize: 18,
  },
  cardText: {
    fontSize: 14,
    color: "#212121",
    fontWeight: "600",
  },
  cardSubText: {
    fontSize: 13,
    color: "#757575",
  },
  modifyText: {
    color: "#007bff",
    fontSize: 14,
    fontWeight: "500",
  },
  cvvSection: {
    marginBottom: 30,
  },
  cvvLabel: {
    fontSize: 14,
    color: "#616161",
    marginBottom: 6,
  },
  cvvInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#212121",
  },
  payButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  processingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  processingText: {
    fontSize: 18,
    color: "#009EE3",
  },
  successWrapper: {
    flex: 1,
    backgroundColor: "#d4edda",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  successHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#155724",
  },
  successCard: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  successQuestion: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    color: "#212121",
  },
  successSuggestion: {
    fontSize: 14,
    color: "#616161",
    marginBottom: 20,
  },
  successButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  successButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MercadoPagoScreen;
