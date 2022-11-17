import { CircularProgress, Grid } from "@mui/material";
import { FC, useEffect, useState } from "react";
import Button from "../../../components/button/Button";
import Input from "../../../components/form/input/Input";
import { StepProps } from "../../../models/steps.model";
import { useMutation } from "@apollo/client";
import { RECOVER_PASSWORD } from "../../../queries/recoverPassword";
import { useDispatch } from "react-redux";
import { setSecret, setToken } from "../../../store/slices/auth";
import "./FirstStep.scss";

const FirstStep: FC<StepProps> = (props) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();

  const [recover, { data, loading }] = useMutation(RECOVER_PASSWORD);

  const handleSubmit = () => {
    recover({ variables: { email } });
  };

  useEffect(() => {
    if (data && data.recoverPassword.token !== "") {
      dispatch(setToken(data.recoverPassword.token));
      dispatch(setSecret(data.recoverPassword.secret));
      props.onSubmit();
    } else {
      setError("Email not found!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return loading ? (
    <CircularProgress />
  ) : (
    <div>
      <Input
        label="E-mail"
        name="email"
        xs={12}
        value={email}
        onChange={(e: any) => setEmail(e.target.value)}
      />
      {error !== "" && (
        <Grid item xs={12} className="error">
          <span>{error}</span>
        </Grid>
      )}
      <Grid item xs={12} className="col col-button">
        <Button label="Next Step" onClick={handleSubmit} disabled={!email} />
      </Grid>
    </div>
  );
};

export default FirstStep;
