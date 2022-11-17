import { FC, useEffect, useReducer, useState } from "react";
import { Grid } from "@mui/material";
import Button from "../../components/button/Button";
import Input from "../../components/form/input/Input";
import InputPassword from "../../components/form/InputPassword";
import { setToken } from "../../helpers/setToken";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SignupForm } from "../../models/signup.model";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "../../queries/signup";
import "./Signup.scss";

const intialState: SignupForm = {
  email: "",
  password: "",
  password2: "",
  question: "",
  secret: "",
};

const Signup: FC = () => {
  const [data, setData] = useReducer(
    (state: SignupForm, newState: any) => ({ ...state, ...newState }),
    intialState
  );
  const [error, setError] = useState<string>("");
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signup, { data: mutationData }] = useMutation(SIGNUP_MUTATION);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData({ [name]: value });
  };

  const handleSubmit = () => {
    if (data.password === data.password2) {
      signup({
        variables: {
          email: data.email,
          password: data.password,
          secret: data.question,
          secretPassword: data.secret,
        },
      });
    } else {
      setError("Passwords don't match!");
    }
  };

  useEffect(() => {
    const canSubmit = !Object.values(data).some((x) => x === null || x === "");
    if (submitForm !== canSubmit) {
      setSubmitForm(canSubmit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (mutationData && mutationData.signup) {
      setError("");
      setToken({
        data: mutationData.signup,
        dispatch,
      });

      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutationData]);

  return (
    <div>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={6} lg={5}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} className="title">
              <h1>Signup</h1>
            </Grid>
            <Input
              label="E-mail"
              name="email"
              xs={12}
              value={data.email}
              onChange={(e) => handleChange(e)}
            />
            <InputPassword
              label="Password"
              name="password"
              xs={6}
              value={data.password}
              onChange={(e) => handleChange(e)}
            />
            <Input
              label="Password"
              name="password2"
              xs={6}
              value={data.password2}
              onChange={(e) => handleChange(e)}
            />
            {!!error && (
              <Grid item xs={12} className="title">
                <span>{error}</span>
              </Grid>
            )}
            <Input
              label="Secret question"
              name="question"
              xs={12}
              value={data.question}
              onChange={(e) => handleChange(e)}
            />
            <Input
              label="Secret Password"
              name="secret"
              xs={12}
              value={data.secret}
              onChange={(e) => handleChange(e)}
            />

            <Grid item xs={12} className="col col-button">
              <Button
                label="Submit"
                onClick={handleSubmit}
                disabled={!submitForm}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Signup;
