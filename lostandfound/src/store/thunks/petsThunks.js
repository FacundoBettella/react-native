import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  fetchPetsPending,
  fetchPetsSuccess,
  fetchPetsFailure,
  savePetPending,
  savePetSuccess,
  savePetFailure,
} from "../slices/petsSlice";
import { db } from "../../config/fb";

export const fetchMyPets = () => {
  return async (dispatch, getState) => {
    const { authUser } = getState().auth;
    const userId = authUser.uid;

    if (!authUser || !userId) {
      return dispatch(
        fetchPetsFailure(
          "User ID is required to fetch pets. No hay usuario autenticado en el store."
        )
      );
    }

    dispatch(fetchPetsPending());

    try {
      const q = query(collection(db, "pets"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const myPets = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt:
            data.createdAt && data.createdAt instanceof Timestamp
              ? data.createdAt.toDate().toISOString()
              : data.createdAt || null,
        };
      });
      dispatch(fetchPetsSuccess(myPets));
    } catch (error) {
      console.error("Error al cargar tus mascotas:", error);
      dispatch(fetchPetsFailure(error.message));
    }
  };
};

export const savePet = (petData, isEditing = false, petId = null) => {
  return async (dispatch) => {
    dispatch(savePetPending());

    try {
      if (isEditing) {
        if (!petId) {
          throw new Error("Pet ID is required for editing.");
        }
        const petRef = doc(db, "pets", petId);
        await updateDoc(petRef, petData);
      } else {
        await addDoc(collection(db, "pets"), petData);
      }
      dispatch(savePetSuccess());
    } catch (error) {
      console.error("Error al guardar la mascota:", error);
      dispatch(savePetFailure(error.message));
    }
  };
};
