import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LocationScreen from "./src/screens/LocationScreen";

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Text>Lost & Found</Text> */}
      <LocationScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
