import { configureStore } from "@reduxjs/toolkit";
import snackbarReducer from "./Slices/SnackbarSlice";
import { GeneralSettings } from "./Slices/GenralSettingsSlice";
import profileInfoReducer from "./Slices/ProjectDataSlice";

export const store = configureStore({
  reducer: {
    snackbar: snackbarReducer,
    generalSettingsData: GeneralSettings.reducer,
    profileInfo: profileInfoReducer,
  },
});
