import { Grid } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button/Button";
import "./ThirdStep.scss";

const ThirdStep: FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Your password was changed successfully</h1>
      <Grid item xs={12} className="col col-button">
        <Button label="Login" onClick={() => navigate("/login")} />
      </Grid>
    </div>
  );
};

export default ThirdStep;
