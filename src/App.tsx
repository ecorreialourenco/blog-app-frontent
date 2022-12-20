import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import Header from "./components/layout/Header";
import { BrowserRouter } from "react-router-dom";
import GuestRouter from "./routes/GuestRouter";
import AuthRouter from "./routes/AuthRouter";
import { setAuth, setLoading, setToken, setUser } from "./store/slices/auth";
import { CircularProgress } from "@mui/material";
import { isExpired, decodeToken } from "react-jwt";
import { User } from "./models/profile.model";
import "./App.css";

const App: FC = () => {
  const { loading, isAuth } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken: string | null = localStorage.getItem("token");
    const token: string =
      !!storedToken && typeof storedToken === "string" ? storedToken : "";
    const isExpiredToken: boolean = isExpired(token);

    dispatch(setLoading(false));

    if (!isExpiredToken) {
      const decoded: any = decodeToken(token);
      const user: User = decoded.user;
      dispatch(setUser(user));
      dispatch(setToken(token));
      dispatch(setAuth(!isExpiredToken));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        {!loading ? (
          isAuth ? (
            <AuthRouter />
          ) : (
            <GuestRouter />
          )
        ) : (
          <CircularProgress />
        )}
      </BrowserRouter>
    </div>
  );
};

export default App;
