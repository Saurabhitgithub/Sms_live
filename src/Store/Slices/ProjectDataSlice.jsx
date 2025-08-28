import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  profilePic: {
    file_url:"",
    file_name:""
  },
};

export const profileSlice = createSlice({
  name: "profileInfo",
  initialState,
  reducers: {
    changeHeaderData: (state, action) => {
      
      return { ...state, ...action.payload };
    },
  },
});

export const { changeHeaderData } = profileSlice.actions;
export default profileSlice.reducer;
