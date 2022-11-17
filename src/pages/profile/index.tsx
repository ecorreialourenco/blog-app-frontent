import { FC, useEffect, useReducer, useState } from "react";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "./Profile.scss";
import { User } from "../../models/profile.model";
import Input from "../../components/form/input/Input";
import Button from "../../components/button/Button";

const intialState: User = {
  username: "",
  email: "",
};

const Profile: FC = () => {
  const [data, setData] = useReducer(
    (state: User, newState: any) => ({ ...state, ...newState }),
    intialState
  );
  const [backupData, setBackupData] = useReducer(
    (state: User, newState: any) => ({ ...state, ...newState }),
    intialState
  );
  const [canUpdate, setCanUpdate] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData({ [name]: value });
  };

  const handleCancel = () => {
    setData(backupData);
    setCanUpdate(false);
  };

  useEffect(() => {
    if (user) {
      setData({
        email: user.email,
      });
      setBackupData({
        email: user.email,
      });
    }
  }, []);

  return (
    <div>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <h1>Profile</h1>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} md={4}>
          <h4>Image</h4>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container className="profile-data-container">
            <Input
              label="Username"
              name="username"
              xs={12}
              value={data.username}
              onChange={(e) => handleChange(e)}
              readOnly={!canUpdate}
            />
            <Input
              label="E-mail"
              name="email"
              xs={12}
              value={data.email}
              onChange={(e) => handleChange(e)}
              readOnly={!canUpdate}
            />
            <Grid item xs={12}>
              <b>Posts:</b> 0
            </Grid>
            <Grid item xs={12}>
              <Grid container justifyContent="space-between">
                {canUpdate ? (
                  <>
                    <Grid item className="col col-button">
                      <Button label="Cancel" onClick={() => handleCancel()} />
                    </Grid>
                    <Grid item className="col col-button">
                      <Button
                        label="Save"
                        onClick={() => setCanUpdate(!canUpdate)}
                      />
                    </Grid>
                  </>
                ) : (
                  <Grid item className="col col-button">
                    <Button label="Update" onClick={() => setCanUpdate(true)} />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
