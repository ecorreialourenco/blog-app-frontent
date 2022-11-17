import { FC, useEffect, useState } from "react";
import { CircularProgress, Grid } from "@mui/material";
import Input from "../../components/form/input/Input";
import Button from "../../components/button/Button";
import InputPassword from "../../components/form/InputPassword";
import { setToken } from "../../helpers/setToken";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { GET_LOGIN } from "../../queries/login";
import "./Login.scss";

const Login: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { loading, data }] = useLazyQuery(GET_LOGIN);
  const handleSubmit = () => {
    login({ variables: { email, password } });
  };

  useEffect(() => {
    const canSubmit = !!email.length && !!password.length;

    if (submitForm !== canSubmit) {
      setSubmitForm(canSubmit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  useEffect(() => {
    if (!!data && data.login) {
      setError("");
      setToken({ data: data.login, dispatch });
      navigate("/");
    } else if (!!data) {
      setError("Email or password doesn't match");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div>
      {loading && <CircularProgress />}
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={4} lg={3}>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            className="login-container"
          >
            <Grid item xs={12} className="title">
              <h1>Login</h1>
            </Grid>
            <Input
              label="E-mail"
              name="email"
              xs={12}
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <InputPassword
              label="Password"
              name="password"
              xs={12}
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
            {!!error && <span>{error}</span>}
            <Grid item xs={12} className="col col-button">
              <Button
                label="Submit"
                onClick={handleSubmit}
                disabled={!submitForm}
              />
            </Grid>
            <Grid item xs={12} className="col col-button">
              <Link to="/recover" className="header-left-link">
                <span>Recover Password</span>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
