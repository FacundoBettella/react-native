// import { useEffect, useState } from "react";
// import {
//   View,
//   TextInput,
//   Button,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   Image,
//   TouchableOpacity,
//   Text,
// } from "react-native";
// import {
//   collection,
//   addDoc,
//   getDoc,
//   doc,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";
// import * as ImagePicker from "expo-image-picker";
// import { auth, db } from "../config/fb";
// import { STATUS_COLORS } from "../utils/statusColors";

// const SelectChips = ({ options, value, onChange }) => (
//   <View style={styles.statusContainer}>
//     {options.map((opt) => {
//       const isSelected = value === opt;
//       return (
//         <TouchableOpacity
//           key={opt}
//           onPress={() => onChange(opt)}
//           style={[
//             styles.chip,
//             {
//               backgroundColor: isSelected ? "#DDEEFF" : "#f0f0f0",
//               borderColor: isSelected ? "#AACCEE" : "#ccc",
//             },
//           ]}
//         >
//           <Text style={{ color: isSelected ? "#003366" : "#555" }}>
//             {opt.charAt(0).toUpperCase() + opt.slice(1)}
//           </Text>
//         </TouchableOpacity>
//       );
//     })}
//   </View>
// );

// export default function AddPetScreen({ navigation, route }) {
//   const isEditing = route?.params?.isEditing;
//   const existingPet = route?.params?.pet;

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
//     const fetchData = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       const profileRef = doc(db, "users", user.uid);
//       const profileSnap = await getDoc(profileRef);
//       if (profileSnap.exists()) {
//         setProfile(profileSnap.data());
//       }

//       if (isEditing && existingPet) {
//         setName(existingPet.name || "");
//         setType(existingPet.type || "");
//         setBreed(existingPet.breed || "");
//         setGender(existingPet.gender || "");
//         setAge(existingPet.age || "");
//         setAddress(existingPet.address || "");
//         setDescription(existingPet.description || "");
//         setStatus(existingPet.status || "perdido");
//         setRetained(existingPet.retained || false);
//         setImage(existingPet.image || null);
//         setLocation({
//           latitude: existingPet.latitude || 0,
//           longitude: existingPet.longitude || 0,
//         });
//       }
//     };
//     fetchData();
//   }, []);

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ["images"],
//       quality: 0.5,
//       base64: true,
//     });
//     if (!result.canceled) {
//       const selectedAsset = result.assets[0];
//       setImage(`data:image/jpeg;base64,${selectedAsset.base64}`);
//     }
//   };

//   const handleSave = async () => {
//     if (!profile) {
//       Alert.alert("Error", "No se pudo obtener la información del usuario.");
//       return;
//     }

//     const requiredFields = [
//       name,
//       type,
//       breed,
//       gender,
//       age,
//       address,
//       description,
//       image,
//     ];
//     if (
//       requiredFields.some(
//         (f) => !f || (typeof f === "string" && f.trim() === "")
//       )
//     ) {
//       Alert.alert(
//         "Faltan datos",
//         "Por favor completá todos los campos requeridos."
//       );
//       return;
//     }

//     const petData = {
//       latitude: location.latitude || 0,
//       longitude: location.longitude || 0,
//       name,
//       type,
//       breed,
//       gender,
//       age,
//       address,
//       retained,
//       status,
//       description,
//       image: { uri: image.uri },
//       phone: profile.phone,
//       owner: `${profile.name} ${profile.surname}`,
//       userId: auth.currentUser.uid,
//       date: isEditing
//         ? existingPet.date
//         : new Date().toLocaleDateString("es-AR"),
//       createdAt: isEditing ? existingPet.createdAt : serverTimestamp(),
//     };

//     try {
//       if (isEditing) {
//         const petRef = doc(db, "pets", existingPet.id);
//         await updateDoc(petRef, petData);
//         Alert.alert("Éxito", "Mascota actualizada correctamente.");
//       } else {
//         await addDoc(collection(db, "pets"), petData);
//         Alert.alert("Éxito", "Mascota registrada correctamente.");
//       }

//       navigation.goBack();
//     } catch (error) {
//       console.error("Error al guardar la mascota:", error);
//       Alert.alert("Error", "No se pudo guardar la mascota.");
//     }
//   };

//   return (
//     <ScrollView
//       contentContainerStyle={[styles.container, { backgroundColor: "#fbfaf4" }]}
//       showsVerticalScrollIndicator={false}
//       bounces={false}
//       overScrollMode="never"
//     >
//       <Text style={styles.label}>Estado</Text>
//       <View style={styles.statusContainer}>
//         {["perdido", "encontrado", "resuelto"].map((item) => {
//           const isSelected = status === item;
//           const colors = STATUS_COLORS[item];

//           return (
//             <TouchableOpacity
//               key={item}
//               onPress={() => setStatus(item)}
//               style={[
//                 styles.chip,
//                 {
//                   backgroundColor: isSelected ? colors.background : "#f0f0f0",
//                   borderColor: isSelected ? colors.border : "#ccc",
//                 },
//               ]}
//             >
//               <Text style={{ color: isSelected ? colors.text : "#555" }}>
//                 {item.charAt(0).toUpperCase() + item.slice(1)}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>

//       {status !== "encontrado" && (
//         <>
//           <Text style={styles.label}>Nombre Mascota</Text>
//           <TextInput
//             placeholder="Nombre de la mascota"
//             value={name}
//             onChangeText={setName}
//             style={styles.input}
//           />
//         </>
//       )}
//       <Text style={styles.label}>Tipo</Text>
//       <SelectChips
//         options={["Perro", "Gato", "Mascota"]}
//         value={type}
//         onChange={setType}
//       />
//       <Text style={styles.label}>Raza</Text>
//       <TextInput
//         placeholder="Raza"
//         value={breed}
//         onChangeText={setBreed}
//         style={styles.input}
//       />

//       <Text style={styles.label}>Género</Text>
//       <SelectChips
//         options={["Macho", "Hembra", "Desconocido"]}
//         value={gender}
//         onChange={setGender}
//       />

//       <Text style={styles.label}>Edad</Text>
//       <SelectChips
//         options={["Cachorro", "Adulto", "Desconocido"]}
//         value={age}
//         onChange={setAge}
//       />
//       <Text style={styles.label}>Dirección</Text>
//       <TextInput
//         placeholder="Dirección"
//         value={address}
//         onChangeText={setAddress}
//         style={styles.input}
//       />
//       <Text style={styles.label}>Descripción</Text>
//       <TextInput
//         placeholder="Descripción"
//         value={description}
//         onChangeText={setDescription}
//         style={[styles.input, { height: 80 }]}
//         multiline
//       />

//       <TouchableOpacity style={styles.customButton} onPress={pickImage}>
//         <Text style={styles.buttonText}>Seleccionar imagen</Text>
//       </TouchableOpacity>
//       {image && <Image source={{ uri: image }} style={styles.image} />}
//       <TouchableOpacity style={styles.customButton} onPress={handleSave}>
//         <Text style={styles.buttonText}>
//           {isEditing ? "Actualizar mascota" : "Guardar mascota"}
//         </Text>
//       </TouchableOpacity>
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
//   label: {
//     fontWeight: "bold",
//     marginBottom: 4,
//     marginTop: 8,
//   },
//   image: {
//     width: "100%",
//     height: 200,
//     marginTop: 12,
//     marginBottom: 12,
//   },
//   statusContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginBottom: 16,
//   },
//   chip: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     borderWidth: 1,
//     fontSize: 14,
//     marginRight: 8,
//     marginBottom: 8,
//   },
//   customButton: {
//     backgroundColor: "#8DA290",
//     paddingVertical: 12,
//     borderRadius: 12,
//     marginVertical: 10,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
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
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector, useDispatch } from "react-redux";
import { STATUS_COLORS } from "../utils/statusColors";
import { savePet } from "../store/thunks/petsThunks";
import { resetSaveStatus } from "../store/slices/petsSlice";

const SelectChips = ({ options, value, onChange }) => (
  <View style={styles.statusContainer}>
    {options.map((opt) => {
      const isSelected = value === opt;
      return (
        <TouchableOpacity
          key={opt}
          onPress={() => onChange(opt)}
          style={[
            styles.chip,
            {
              backgroundColor: isSelected ? "#DDEEFF" : "#f0f0f0",
              borderColor: isSelected ? "#AACCEE" : "#ccc",
            },
          ]}
        >
          <Text style={{ color: isSelected ? "#003366" : "#555" }}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default function AddPetScreen({ navigation, route }) {
  const isEditing = route?.params?.isEditing;
  const existingPet = route?.params?.pet;

  const dispatch = useDispatch();
  const { saving, saveError, saveSuccess } = useSelector((state) => state.pets);
  const { authUser, profile } = useSelector((state) => state.auth);

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

  // Cargar datos iniciales de la mascota y el perfil
  useEffect(() => {
    const fetchData = async () => {
      if (!authUser) {
        Alert.alert(
          "Error",
          "Debes iniciar sesión para añadir o editar mascotas."
        );
        navigation.goBack();
        return;
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
        // Ajustar la imagen si viene del store y no es el URI directo
        setImage(existingPet.image?.uri || existingPet.image || null);
        setLocation({
          latitude: existingPet.latitude || 0,
          longitude: existingPet.longitude || 0,
        });
      }
    };
    fetchData();
  }, [isEditing, existingPet, authUser]);

  // Manejar el estado de éxito/error de la operación de guardar
  useEffect(() => {
    if (saveSuccess) {
      dispatch(resetSaveStatus());
      Alert.alert(
        "Éxito",
        isEditing
          ? "Mascota actualizada correctamente."
          : "Mascota registrada correctamente.",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("Main", {
                screen: "Mis Mascotas",
                // Opcional: merge: true para mantener otros params si existieran
                // params: { someParam: 'value' },
              }),
          },
        ]
      );
    }
    if (saveError) {
      Alert.alert("Error", "No se pudo guardar la mascota: " + saveError);
      dispatch(resetSaveStatus()); // Resetea el estado de guardado
    }
  }, [saveSuccess, saveError, isEditing]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setImage(`data:image/jpeg;base64,${selectedAsset.base64}`);
    }
  };

  const handleSave = async () => {
    if (!profile) {
      Alert.alert("Error", "No se pudo obtener la información del usuario.");
      return;
    }

    const requiredFields = [
      name,
      type,
      breed,
      gender,
      age,
      address,
      description,
      image,
    ];
    if (
      requiredFields.some(
        (f) => !f || (typeof f === "string" && f.trim() === "")
      )
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
      image: { uri: image }, // Asegúrate de que `image` sea el URI aquí
      phone: profile.phone,
      owner: `${profile.name} ${profile.surname}`,
      userId: authUser.uid,
      // Firebase Timestamps solo en la creación
      date: isEditing
        ? existingPet.date // Mantener la fecha existente si se edita
        : new Date().toLocaleDateString("es-AR"), // Formato de fecha para mostrar
      createdAt: isEditing
        ? existingPet.createdAt // Mantener el createdAt existente si se edita
        : serverTimestamp(), // Usar serverTimestamp solo para nuevas creaciones
    };

    // Despachar el thunk savePet
    dispatch(savePet(petData, isEditing, existingPet?.id));
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: "#fbfaf4" }]}
      showsVerticalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
    >
      <Text style={styles.label}>Estado</Text>
      <View style={styles.statusContainer}>
        {["perdido", "encontrado", "resuelto"].map((item) => {
          const isSelected = status === item;
          const colors = STATUS_COLORS[item];

          return (
            <TouchableOpacity
              key={item}
              onPress={() => setStatus(item)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.background : "#f0f0f0",
                  borderColor: isSelected ? colors.border : "#ccc",
                },
              ]}
            >
              <Text style={{ color: isSelected ? colors.text : "#555" }}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {status !== "encontrado" && (
        <>
          <Text style={styles.label}>Nombre Mascota</Text>
          <TextInput
            placeholder="Nombre de la mascota"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </>
      )}
      <Text style={styles.label}>Tipo</Text>
      <SelectChips
        options={["Perro", "Gato", "Mascota"]}
        value={type}
        onChange={setType}
      />
      <Text style={styles.label}>Raza</Text>
      <TextInput
        placeholder="Raza"
        value={breed}
        onChangeText={setBreed}
        style={styles.input}
      />

      <Text style={styles.label}>Género</Text>
      <SelectChips
        options={["Macho", "Hembra", "Desconocido"]}
        value={gender}
        onChange={setGender}
      />

      <Text style={styles.label}>Edad</Text>
      <SelectChips
        options={["Cachorro", "Adulto", "Desconocido"]}
        value={age}
        onChange={setAge}
      />
      <Text style={styles.label}>Dirección</Text>
      <TextInput
        placeholder="Dirección"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <TouchableOpacity style={styles.customButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Seleccionar imagen</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity
        style={styles.customButton}
        onPress={handleSave}
        disabled={saving} // Deshabilita el botón mientras se guarda
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isEditing ? "Actualizar mascota" : "Guardar mascota"}
          </Text>
        )}
      </TouchableOpacity>
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
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 8,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 12,
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    fontSize: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  customButton: {
    backgroundColor: "#8DA290",
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
