import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../models/profile.model";

interface AuthModel {
  loading: boolean;
  isAuth: boolean;
  user: User | null;
  token: string;
  secret: string;
}

const initialState: AuthModel = {
  loading: true,
  isAuth: false,
  user: null,
  token: "",
  secret: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setSecret: (state, action) => {
      state.secret = action.payload;
    },
  },
});

export const { setAuth, setLoading, setUser, setToken, setSecret } =
  authSlice.actions;

export default authSlice.reducer;
