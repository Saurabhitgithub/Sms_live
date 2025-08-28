import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    show: false,
    detail: "",
    severity: "",
};

const snackbarSlice = createSlice({
    name: 'snakbar',
    initialState,
    reducers: {
        success: (state, action) => {
            state.show = action.payload.show;
            state.detail = action.payload.msg;
            state.severity = 'success';
            state.redirectLink = action.payload.link || null;
        },
        error: (state, action) => {
            state.show = action.payload.show;
            state.detail = action.payload.msg;
            state.severity = 'error';
            state.redirectLink = action.payload.link || null;
        },
        info: (state, action) => {
            state.show = action.payload.show;
            state.detail = action.payload.msg;
            state.severity = 'info';
            state.redirectLink = action.payload.link || null;
        },
    },
});

export const { success, error, info } = snackbarSlice.actions;
export default snackbarSlice.reducer;