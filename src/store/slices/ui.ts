import { createSlice } from "@reduxjs/toolkit";

interface UIModel {
  loading: boolean;
  currentTab: number;
}

const initialState: UIModel = {
  loading: false,
  currentTab: 0,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
  },
});

export const { setLoading, setCurrentTab } = uiSlice.actions;

export default uiSlice.reducer;
