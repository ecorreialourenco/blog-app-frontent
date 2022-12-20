import { User } from "../models/profile.model";
import {
  setAuth,
  setUser,
  setToken as setUserToken,
} from "../store/slices/auth";
import { decodeToken } from "react-jwt";

interface TokenParams {
  data: string;
  dispatch: any;
}

export const setToken = (params: TokenParams) => {
  const { data, dispatch } = params;
  const decoded: any = decodeToken(data);
  const user: User = decoded.user;

  dispatch(setUser(user));
  dispatch(setUserToken(data));
  localStorage.setItem("token", data);
  dispatch(setAuth(true));
};
