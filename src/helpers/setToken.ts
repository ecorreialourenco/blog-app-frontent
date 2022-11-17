import { setAuth, setUser } from "../store/slices/auth";

interface TokenParams {
  id: number;
  email: string;
  dispatch: any;
}

export const setToken = (params: TokenParams) => {
  const { id, email, dispatch } = params;

  localStorage.setItem(
    "token",
    JSON.stringify({
      id: 1,
      email,
    })
  );

  dispatch(setAuth(true));
  dispatch(setUser({ id, email }));
};
