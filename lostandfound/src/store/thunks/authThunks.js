import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../config/fb";
import { clearUser, setUser } from "../slices/authSlice";
import {
  initializeAuthListener,
  removeAuthListener,
} from "../../utils/authListener";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const loginUser = (email, password) => async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    initializeAuthListener();

    return { success: true };
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return { success: false, message: error.message };
  }
};

export const registerUserManual = ({
  email,
  password,
  name,
  surname,
  phone,
}) => {
  return async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const profileRef = doc(db, "users", userCredential.user.uid);
      await setDoc(profileRef, {
        name,
        surname,
        phone,
        email: userCredential.user.email,
      });

      return { success: true };
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return { success: false, error: error.message };
    }
  };
};

export const logoutUser = () => async (dispatch) => {
  try {
    await signOut(auth); // cierra la sesión
    removeAuthListener(); // corta el listener de auth
    dispatch(clearUser()); // borra el usuario en el store
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    // Podrías despachar otro action para manejar errores si lo necesitás
  }
};

export const updateUserProfile =
  (profileData) => async (dispatch, getState) => {
    try {
      const { authUser } = getState().auth;

      if (!authUser || !authUser.uid)
        throw new Error("No hay usuario autenticado en el store.");

      const profileRef = doc(db, "users", authUser.uid);

      await setDoc(profileRef, {
        ...profileData,
        email: authUser.email, // Se mantiene sincronizado
      });

      const profileSnap = await getDoc(profileRef);

      dispatch(
        setUser({
          authUser: {
            uid: authUser.uid,
            email: authUser.email,
          },
          profile: profileSnap.exists() ? profileSnap.data() : null,
        })
      );

      return { success: true };
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      return { success: false, error };
    }
  };
