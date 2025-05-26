import { View, Text, Image, StyleSheet } from "react-native";

const PetDetailScreen = ({ route }) => {
  const { pet } = route.params;

  return (
    <View style={styles.container}>
      <Image source={pet.image} style={styles.image} />
      <Text style={styles.name}>{pet.name}</Text>
      <Text style={styles.type}>Tipo: {pet.type}</Text>
      <Text style={styles.status}>
        Estado: {pet.status === "perdido" ? "Perdido" : "Encontrado"}
      </Text>
    </View>
  );
};

export default PetDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  image: { width: 200, height: 200, borderRadius: 12, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  type: { fontSize: 18, marginBottom: 5 },
  status: { fontSize: 18 },
});
