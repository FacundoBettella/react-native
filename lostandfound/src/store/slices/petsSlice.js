import { createSlice } from "@reduxjs/toolkit";

const petsSlice = createSlice({
  name: "pets",
  initialState: {
    list: [],
    loading: false,
    error: null,
    canAddPet: false,
    loadedInitially: false,
    // Nuevos estados para operaciones de guardar/actualizar
    saving: false, // para la operación de añadir/actualizar
    saveError: null, // para errores al añadir/actualizar
    saveSuccess: false, // para indicar que la operación fue exitosa
  },
  reducers: {
    fetchPetsPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPetsSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
      const activePets = action.payload.filter(
        (pet) => pet.status === "perdido" || pet.status === "encontrado"
      );
      state.canAddPet = activePets.length < 2;
      state.loadedInitially = true;
    },
    fetchPetsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.loadedInitially = true;
    },
    clearPets: (state) => {
      state.list = [];
      state.loadedInitially = false;
      state.loading = false;
      state.error = null;
      state.canAddPet = false;
    },
    // Nuevas acciones para añadir/actualizar una mascota
    savePetPending: (state) => {
      state.saving = true;
      state.saveError = null;
      state.saveSuccess = false;
    },
    savePetSuccess: (state) => {
      state.saving = false;
      state.saveSuccess = true;
      state.saveError = null;
      // Cuando guardamos/actualizamos, la lista de mascotas en MyPetsScreen
      // queda desactualizada, así que invalidamos el caché para que se recargue
      // la próxima vez que se acceda a MyPetsScreen.
      state.loadedInitially = false;
    },
    savePetFailure: (state, action) => {
      state.saving = false;
      state.saveError = action.payload;
      state.saveSuccess = false;
    },
    // Acción para resetear el estado de guardar/actualizar (útil después de mostrar un mensaje)
    resetSaveStatus: (state) => {
      state.saving = false;
      state.saveError = null;
      state.saveSuccess = false;
    },
  },
});

export const {
  fetchPetsPending,
  fetchPetsSuccess,
  fetchPetsFailure,
  clearPets,
  savePetPending,
  savePetSuccess,
  savePetFailure,
  resetSaveStatus,
} = petsSlice.actions;

export default petsSlice.reducer;
