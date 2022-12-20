import { FC, useEffect, useState } from "react";
import { CircularProgress, Grid } from "@mui/material";
import InputPassword from "../../../components/form/InputPassword";
import Button from "../../../components/button/Button";
import { StepProps } from "../../../models/steps.model";
import { CHANGE_PASSWORD } from "../../../queries/recoverPassword";
import { useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import Input from "../../../components/form/input/Input";
import "./SecondStep.scss";

const SecondStep: FC<StepProps> = (props) => {
  const [secretPassword, setSecretPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const { token, secret } = useSelector((state: RootState) => state.auth);

  const [recover, { loading, data }] = useMutation(CHANGE_PASSWORD);

  const handleSubmit = () => {
    if (password === password2) {
      recover({
        variables: {
          secretPassword,
          newPassword: password,
          recoverToken: token,
        },
      });
    } else {
      setError("Sorry but passwords don't match!");
    }
  };

  useEffect(() => {
    if (password !== "" && password2 !== "") {
      !submitForm && setSubmitForm(true);
    } else {
      submitForm && setSubmitForm(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, password2]);

  useEffect(() => {
    if (data && data.changePassword) {
      setError("");
      props.onSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return loading ? (
    <CircularProgress />
  ) : (
    <div>
      <span>{secret}</span>
      <Input
        label="Secret Password"
        name="secret"
        xs={12}
        value={secretPassword}
        onChange={(e) => setSecretPassword(e.target.value)}
      />
      <InputPassword
        label="New Password"
        name="password"
        xs={12}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <InputPassword
        label="New Password"
        name="password2"
        xs={12}
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
      />
      {error !== "" && (
        <Grid item xs={12} className="error">
          <span>{error}</span>
        </Grid>
      )}

      <Grid item xs={12} className="col col-button">
        <Button label="Submit" onClick={handleSubmit} disabled={!submitForm} />
      </Grid>
    </div>
  );
};

export default SecondStep;
