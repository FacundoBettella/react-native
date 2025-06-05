import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import logoImage from "../../assets/adaptive-icon.png";

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
    >
      <View style={styles.header}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.headerText}>Bienvenido a Lost & Found</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>¿Qué es Lost & Found?</Text>
        <Text style={styles.infoDescription}>
          Somos una comunidad dedicada a **reunir mascotas perdidas con sus
          dueños**, sin importar la ubicación. Aquí, los dueños pueden reportar
          a sus mascotas extraviadas, y las personas que encuentran un animal
          solo pueden avisar a la comunidad con la intención de reunir a la
          mascota con su hogar. Creemos en el poder de la colaboración para
          ayudar a nuestros amigos peludos a volver a casa.
        </Text>
        <Text style={styles.infoDescription}>
          En el mapa encontrarás indicadores de mascotas perdidas y encontradas.
          Podrás subir fotos y añadir detalles para facilitar el reencuentro.
        </Text>
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
    flexGrow: 1, // Permite el scroll si el contenido es muy largo
    backgroundColor: "#f0f2f5", // Fondo gris claro
    alignItems: "center",
    paddingBottom: 30, // Espacio al final
  },
  header: {
    paddingVertical: 40,
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 100, // Ajusta el tamaño de tu logo según sea necesario
    height: 100,
    resizeMode: "contain", // Asegura que la imagen se escale correctamente
    marginBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50", // Acento verde
    marginBottom: 15,
    textAlign: "center",
  },
  infoDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 10, // Espacio entre párrafos
  },
  exploreButton: {
    backgroundColor: "#2196F3", // Botón primario azul
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
