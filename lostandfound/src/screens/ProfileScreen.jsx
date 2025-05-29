import { View, Text, Button } from "react-native";
import { auth } from "../config/fb";

const ProfileScreen = () => {
  const logout = () => auth.signOut();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bienvenido a tu perfil</Text>
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
};

export default ProfileScreen;
