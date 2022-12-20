import { FC, useEffect, useReducer, useState } from "react";
import {
  Grid,
  Button as MButton,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { User } from "../../models/profile.model";
import Input from "../../components/form/input/Input";
import Button from "../../components/button/Button";
import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE } from "../../queries/profile";
import { setToken } from "../../helpers/setToken";
import "./Profile.scss";

const intialState: User = {
  id: 0,
  username: "",
  email: "",
  image: "",
};

const Profile: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
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
  const dispatch = useDispatch();

  const [updateProfile, { loading: loadingProfile, data: profileData }] =
    useMutation(UPDATE_PROFILE);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData({ [name]: value });
  };

  const handleCancel = () => {
    setData(backupData);
    setCanUpdate(false);
  };

  const handeUpdateProfile = () => {
    setLoading(true);
    updateProfile({
      variables: data,
    });
    setCanUpdate(false);
  };

  const handleFileRead = async (event: any) => {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      setData({ image: fileReader.result });
    });
    fileReader.readAsDataURL(file);
  };

  useEffect(() => {
    if (user) {
      const userData = {
        id: user.id,
        username: user.username || "",
        email: user.email || "",
        image: user.image || "",
      };
      setData(userData);
      setBackupData(userData);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profileData) {
      setToken({
        data: profileData.updateProfile,
        dispatch,
      });
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  return loading || loadingProfile ? (
    <div className="loading">
      <CircularProgress />
    </div>
  ) : (
    <div>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <h1>Profile</h1>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} md={4}>
          <>
            {data.image ? (
              <Avatar src={data.image} className="profile-avatar" />
            ) : (
              <Avatar className="profile-avatar">
                <span>No Image</span>
              </Avatar>
            )}
            {canUpdate && (
              <MButton variant="contained" component="label">
                Upload
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleFileRead}
                />
              </MButton>
            )}
          </>
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
                        onClick={() => handeUpdateProfile()}
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
