import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    logo: '',
    color: "",
    backgroundColor: "",
};


export const GeneralSettings = createSlice({
    name: 'topBarData',
    initialState,
    reducers: {
        updateGeneralSettings: (state, action) => {
            return ({ ...state, ...action.payload })
        }
    }
})


export const { updateGeneralSettings } = GeneralSettings.actions 