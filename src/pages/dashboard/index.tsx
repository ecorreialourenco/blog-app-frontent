import { Grid } from "@mui/material";
import { FC } from "react";

import "./Dashboard.scss";

const Dashboard: FC = () => {
  return (
    <div>
      <Grid container justifyContent="center">
        <Grid item xs={12} className="title">
          <h1>Dashboard</h1>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
