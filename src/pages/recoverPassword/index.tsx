import { Grid } from "@mui/material";
import { FC, useState } from "react";
import FirstStep from "./steps/FirstStep";
import SecondStep from "./steps/SecondStep";
import ThirdStep from "./steps/ThirdStep";

const RecoverPassword: FC = () => {
  const [step, setStep] = useState<string>("0");

  const renderSteps = () => {
    switch (step) {
      case "1":
        return <SecondStep onSubmit={() => setStep("2")} />;
      case "2":
        return <ThirdStep />;
      default:
        return <FirstStep onSubmit={() => setStep("1")} />;
    }
  };

  return (
    <div>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={4} lg={3}>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            className="login-container"
          >
            <>
              <Grid item xs={12} className="title">
                <h1>Recover Password</h1>
              </Grid>
              {renderSteps()}
            </>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default RecoverPassword;
