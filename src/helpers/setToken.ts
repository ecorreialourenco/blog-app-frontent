import { User } from "../models/profile.model";
import { setAuth, setUser } from "../store/slices/auth";

interface TokenParams {
  data: User;
  dispatch: any;
}

export const setToken = (params: TokenParams) => {
  const { data, dispatch } = params;

  localStorage.setItem("token", JSON.stringify(data));

  dispatch(setAuth(true));
  dispatch(setUser(data));
};
