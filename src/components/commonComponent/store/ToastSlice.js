const { createSlice } = require("@reduxjs/toolkit");

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    icon: "",
    detail: "",
    visible: false,
  },
  reducers: {
    success: (state, action) => {
        state.icon = 'success';
        state.detail = action.payload.msg;
        state.visible = action.payload.visible;
    },
    error: (state, action) => {
        state.icon = 'error';
        state.detail = action.payload.msg;
        state.visible = action.payload.visible;
    },
    info: (state, action) => {
        state.icon = 'info';
        state.detail = action.payload.msg;
        state.visible = action.payload.visible;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;