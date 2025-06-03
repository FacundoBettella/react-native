// import { useEffect, useState } from "react";
// import {
//   View,
//   TextInput,
//   Button,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   Image,
// } from "react-native";
// import {
//   collection,
//   addDoc,
//   getDoc,
//   doc,
//   serverTimestamp,
// } from "firebase/firestore";
// import * as ImagePicker from "expo-image-picker";
// import { auth, db } from "../config/fb";

// export default function AddPetScreen({ navigation }) {
//   const [profile, setProfile] = useState(null);
//   const [name, setName] = useState("");
//   const [type, setType] = useState("");
//   const [breed, setBreed] = useState("");
//   const [gender, setGender] = useState("");
//   const [age, setAge] = useState("");
//   const [address, setAddress] = useState("");
//   const [status, setStatus] = useState("perdido");
//   const [retained, setRetained] = useState(false);
//   const [description, setDescription] = useState("");
//   const [image, setImage] = useState(null);
//   const [location, setLocation] = useState({ latitude: null, longitude: null });

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const user = auth.currentUser;
//       if (!user) return;
//       const profileRef = doc(db, "users", user.uid);
//       const profileSnap = await getDoc(profileRef);
//       if (profileSnap.exists()) {
//         setProfile(profileSnap.data());
//       }
//     };
//     fetchProfile();
//   }, []);

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ["images"],
//       quality: 0.5,
//       base64: true,
//     });
//     if (!result.canceled) {
//       setImage(result.assets[0]);
//     }
//   };

//   const handleSave = async () => {
//     if (!profile) {
//       Alert.alert("Error", "No se pudo obtener la información del usuario.");
//       return;
//     }

//     if (
//       !name ||
//       !type ||
//       !breed ||
//       !gender ||
//       !age ||
//       !address ||
//       !description ||
//       !image
//     ) {
//       Alert.alert(
//         "Faltan datos",
//         "Por favor completá todos los campos requeridos."
//       );
//       return;
//     }

//     try {
//       const petData = {
//         latitude: location.latitude || 0,
//         longitude: location.longitude || 0,
//         name,
//         type,
//         breed,
//         gender,
//         age,
//         date: new Date().toLocaleDateString("es-AR"),
//         address,
//         retained,
//         status,
//         owner: `${profile.name} ${profile.surname}`,
//         phone: profile.phone,
//         image: { uri: image.uri },
//         description,
//         userId: auth.currentUser.uid,
//         createdAt: serverTimestamp(),
//       };

//       await addDoc(collection(db, "pets"), petData);

//       Alert.alert("Éxito", "Mascota registrada correctamente.");
//       navigation.goBack();
//     } catch (error) {
//       console.error("Error al guardar la mascota:", error);
//       Alert.alert("Error", "No se pudo guardar la mascota.");
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <TextInput
//         placeholder="Nombre de la mascota"
//         value={name}
//         onChangeText={setName}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Tipo (Perro, Gato...)"
//         value={type}
//         onChangeText={setType}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Raza"
//         value={breed}
//         onChangeText={setBreed}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Género"
//         value={gender}
//         onChangeText={setGender}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Edad"
//         value={age}
//         onChangeText={setAge}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Dirección"
//         value={address}
//         onChangeText={setAddress}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Descripción"
//         value={description}
//         onChangeText={setDescription}
//         style={[styles.input, { height: 80 }]}
//         multiline
//       />
//       <Button title="Seleccionar imagen" onPress={pickImage} />
//       {image && <Image source={{ uri: image.uri }} style={styles.image} />}
//       <Button title="Guardar mascota" onPress={handleSave} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   image: {
//     width: "100%",
//     height: 200,
//     marginTop: 12,
//     marginBottom: 12,
//   },
// });

import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../config/fb";

export default function AddPetScreen({ navigation, route }) {
  const isEditing = route?.params?.isEditing;
  const existingPet = route?.params?.pet;

  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("perdido");
  const [retained, setRetained] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  // Cargar perfil y datos si es edición
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const profileRef = doc(db, "users", user.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        setProfile(profileSnap.data());
      }

      if (isEditing && existingPet) {
        setName(existingPet.name || "");
        setType(existingPet.type || "");
        setBreed(existingPet.breed || "");
        setGender(existingPet.gender || "");
        setAge(existingPet.age || "");
        setAddress(existingPet.address || "");
        setDescription(existingPet.description || "");
        setStatus(existingPet.status || "perdido");
        setRetained(existingPet.retained || false);
        setImage(existingPet.image || null);
        setLocation({
          latitude: existingPet.latitude || 0,
          longitude: existingPet.longitude || 0,
        });
      }
    };
    fetchData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSave = async () => {
    if (!profile) {
      Alert.alert("Error", "No se pudo obtener la información del usuario.");
      return;
    }

    if (
      !name ||
      !type ||
      !breed ||
      !gender ||
      !age ||
      !address ||
      !description ||
      !image
    ) {
      Alert.alert(
        "Faltan datos",
        "Por favor completá todos los campos requeridos."
      );
      return;
    }

    const petData = {
      latitude: location.latitude || 0,
      longitude: location.longitude || 0,
      name,
      type,
      breed,
      gender,
      age,
      address,
      retained,
      status,
      description,
      image: { uri: image.uri },
      phone: profile.phone,
      owner: `${profile.name} ${profile.surname}`,
      userId: auth.currentUser.uid,
      date: isEditing
        ? existingPet.date
        : new Date().toLocaleDateString("es-AR"),
      createdAt: isEditing ? existingPet.createdAt : serverTimestamp(),
    };

    try {
      if (isEditing) {
        const petRef = doc(db, "pets", existingPet.id);
        await updateDoc(petRef, petData);
        Alert.alert("Éxito", "Mascota actualizada correctamente.");
      } else {
        await addDoc(collection(db, "pets"), petData);
        Alert.alert("Éxito", "Mascota registrada correctamente.");
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar la mascota:", error);
      Alert.alert("Error", "No se pudo guardar la mascota.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Nombre de la mascota"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Tipo (Perro, Gato...)"
        value={type}
        onChangeText={setType}
        style={styles.input}
      />
      <TextInput
        placeholder="Raza"
        value={breed}
        onChangeText={setBreed}
        style={styles.input}
      />
      <TextInput
        placeholder="Género"
        value={gender}
        onChangeText={setGender}
        style={styles.input}
      />
      <TextInput
        placeholder="Edad"
        value={age}
        onChangeText={setAge}
        style={styles.input}
      />
      <TextInput
        placeholder="Dirección"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />
      <Button title="Seleccionar imagen" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      <Button
        title={isEditing ? "Actualizar mascota" : "Guardar mascota"}
        onPress={handleSave}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 12,
    marginBottom: 12,
  },
});
