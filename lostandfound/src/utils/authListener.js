import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/fb";
import { store } from "../store";
import { setUser } from "../store/slices/authSlice";
import { sanitizeFirebaseUser } from "./sanitizeFirebaseUser";
import { doc, getDoc } from "firebase/firestore";

let unsubscribeAuth = null;

export const initializeAuthListener = () => {
  if (unsubscribeAuth) return;

  unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const cleanUser = sanitizeFirebaseUser(user);

      try {
        const profileRef = doc(db, "users", cleanUser.uid);
        const profileSnap = await getDoc(profileRef);
        const profileData = profileSnap.exists() ? profileSnap.data() : null;

        store.dispatch(
          setUser({
            authUser: cleanUser,
            profile: profileData,
          })
        );
      } catch (error) {
        console.error("Error fetching user profile from Firestore:", error);
        store.dispatch(setUser({ authUser: cleanUser, profile: null }));
      }
    } else {
      store.dispatch(setUser(null));
    }
  });
};

// Permite cortar la suscripción cuando quieras
export const removeAuthListener = () => {
  if (unsubscribeAuth) {
    unsubscribeAuth(); // corta la suscripción
    unsubscribeAuth = null;
  }
};
