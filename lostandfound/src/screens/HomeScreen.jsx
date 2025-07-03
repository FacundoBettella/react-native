import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import logoImage from "../../assets/adaptive-icon.png";
import { useSelector } from "react-redux";

const HomeScreen = ({ navigation }) => {
  const { profile } = useSelector((state) => state.auth);
  const userName = profile?.name;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
    >
      <View style={styles.header}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.headerText}>
          {userName ? `🐾 Hola ${userName}! 🐾` : "Bienvenido a Lost & Found"}
        </Text>
      </View>

      {/* Fondo con color pastel celeste en vez de imagen */}
      <View style={styles.backgroundColorContainer}>
        <View style={styles.bubbleContainer}>
          {/* FILA 1 */}
          <View style={styles.row}>
            <View style={styles.bubble}>
              <Image
                source={require("../../assets/pet-lost.png")}
                style={styles.bubbleImage}
              />
              <Text style={styles.bubbleTitle}>
                ¿Perdiste o encontraste una mascota? 🐶🐱
              </Text>
            </View>
            <View style={styles.textBox}>
              <Text style={styles.bubbleDescription}>
                Reportá mascotas perdidas o avisá si encontraste una.
                ¡Ayudá a que vuelvan a casa!
              </Text>
            </View>
          </View>

          {/* FILA 2 (invertida) */}
          <View style={styles.row}>
            <View style={styles.textBox}>
              <Text style={styles.bubbleDescription}>
                En el mapa vas a ver ubicaciones con reportes activos.
                Podés agregar fotos y detalles.
              </Text>
            </View>
            <View style={styles.bubble}>
              <Image
                source={require("../../assets/mapa-icono.png")}
                style={styles.bubbleImage}
              />
              <Text style={styles.bubbleTitle}>
                Usá el mapa para reportar o buscar 📍
              </Text>
            </View>
          </View>

          {/* FILA 3 */}
          <View style={styles.row}>
            <View style={styles.bubble}>
              <Image
                source={require("../../assets/comunidad.png")}
                style={styles.bubbleImage}
              />
              <Text style={styles.bubbleTitle}>Somos una comunidad que ayuda ❤️</Text>
            </View>
            <View style={styles.textBox}>
              <Text style={styles.bubbleDescription}>
                Miles de personas colaboran para reunir mascotas con sus familias.
                ¡Sumate!
              </Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate("Mapa")}
      >
        <Text style={styles.exploreButtonText}>¡Empezar a Explorar!</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#e7e6e0",
    alignItems: "center",
    paddingBottom: 30,
  },
  header: {
    paddingVertical: 25,
    alignItems: "center",
    backgroundColor: "#faf9f3",
    width: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  backgroundColorContainer: {
    width: "90%",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "rgb(187, 211, 218)", 
  },
  bubbleContainer: {
    gap: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  bubble: {
    backgroundColor: "#ffffffcc",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    width: 130,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bubbleImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 6,
  },
  bubbleTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  textBox: {
    flex: 1,
    justifyContent: "center",
  },
  bubbleDescription: {
    fontSize: 14,
    color: "#000000", 
    lineHeight: 20,
    textAlign: "left",
  },
  exploreButton: {
    backgroundColor: "#d8693f",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
