import { FC } from "react";
import { Grid, Tab, Tabs } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Status } from "../../enum/status.enum";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { setCurrentTab } from "../../store/slices/ui";
import FriendsList from "./components/FriendsList";
import UserList from "./components/UserList";
import BlockedList from "./components/BlockedList";
import RequestList from "./components/RequestList";
import "./Users.scss";

const Users: FC = () => {
  const { currentTab } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(setCurrentTab(newValue));
  };

  const renderComponents = () => {
    switch (currentTab) {
      case 1:
        // Aprovals
        return <RequestList key={1} isOwn={false} />;
      case 2:
        // Requests
        return <RequestList key={2} isOwn={true} />;
      case 3:
        // ALl users
        return <UserList key={3} />;
      case 4:
        // Blocked users
        return <BlockedList key={4} />;
      default:
        // Friends list
        return <FriendsList key={0} currentStatus={[Status.ACEPT]} />;
    }
  };

  return (
    <Grid className="users-container" container justifyContent="center">
      <Grid item xs={12} className="users-title">
        <h1>Users</h1>
      </Grid>
      <Grid item xs={12} className="users-list">
        <Grid
          container
          justifyContent="center"
          spacing={2}
          className="users-tab-container"
        >
          <Tabs value={currentTab} onChange={handleChangeTab}>
            <Tab icon={<Diversity3Icon />} label="Friends" />
            <Tab icon={<GroupAddIcon />} label="Aprovals" />
            <Tab icon={<GroupAddIcon />} label="Requests" />
            <Tab icon={<GroupsIcon />} label="Users" />
            <Tab icon={<PersonOffIcon />} label="Blocked Users" />
          </Tabs>
        </Grid>
        {renderComponents()}
      </Grid>
    </Grid>
  );
};

export default Users;
