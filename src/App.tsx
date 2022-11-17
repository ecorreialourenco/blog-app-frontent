import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import Header from "./components/layout/Header";
import { BrowserRouter } from "react-router-dom";
import GuestRouter from "./routes/GuestRouter";
import AuthRouter from "./routes/AuthRouter";
import { setAuth, setLoading, setUser } from "./store/slices/auth";
import { CircularProgress } from "@mui/material";
import "./App.css";

const App: FC = () => {
  const { loading, isAuth } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const token = !!storedToken ? JSON.parse(storedToken) : null;
    dispatch(setLoading(false));
    dispatch(setUser(token));
    dispatch(setAuth(!!token));
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
