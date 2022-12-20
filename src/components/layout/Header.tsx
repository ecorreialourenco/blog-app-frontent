import { FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Avatar, Badge, Menu, MenuItem, Tooltip } from "@mui/material";
import { setAuth } from "../../store/slices/auth";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faComments,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useLazyQuery, useSubscription } from "@apollo/client";
import { GET_REQUESTS_COUNT } from "../../queries/layout";
import { UPDATE_FRIEND_SUBSCRIPTION } from "../../queries/users";
import "./Header.scss";

const Header: FC = () => {
  const { isAuth, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [friendsRequest, setFriendsRequest] = useState<number>(0);
  const navigate = useNavigate();

  const [getCount, { data }] = useLazyQuery(GET_REQUESTS_COUNT);
  const { data: dataFriendChanged } = useSubscription(
    UPDATE_FRIEND_SUBSCRIPTION,
    {
      variables: { userId: user?.id },
    }
  );

  const handleClickAvatar = (event: any) => {
    setOpenMenu(true);
    setAnchorEl(event.currentTarget);
  };

  const handleNavigate = (location: string) => {
    // Close menu if it's open
    openMenu && setOpenMenu(false);
    navigate(location);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setAuth(null));
  };

  useEffect(() => {
    if (data && data.listRequests) {
      setFriendsRequest(data.listRequests.totalRecords);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (user) {
      getCount({ variables: { userId: user.id }, fetchPolicy: "network-only" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, dataFriendChanged]);

  return useMemo(
    () => (
      <header className="header">
        <div className="header-left-side">
          <Link to="/" className="header-left-link">
            <span>Blog APP</span>
          </Link>
        </div>
        <div className="header-right-side">
          {isAuth ? (
            <>
              <Tooltip title="Users">
                <Badge
                  badgeContent={friendsRequest}
                  className="header-items"
                  color="primary"
                >
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    className="header-icons"
                    onClick={() => handleNavigate("/users")}
                  />
                </Badge>
              </Tooltip>
              <Tooltip title="My blog">
                <FontAwesomeIcon
                  icon={faComments}
                  className="header-icons header-items"
                  onClick={() => handleNavigate("/blog")}
                />
              </Tooltip>
              {user?.image ? (
                <Avatar src={user.image} onClick={handleClickAvatar} />
              ) : (
                <Avatar onClick={handleClickAvatar}>
                  <FontAwesomeIcon icon={faUser} />
                </Avatar>
              )}
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={() => setOpenMenu(false)}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={() => handleNavigate("/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Link to="/login" className="header-right-link">
                <span className="right-buttons">Login</span>
              </Link>
              <Link to="/signup" className="header-right-link">
                <span className="right-buttons">Signup</span>
              </Link>
            </>
          )}
        </div>
      </header>
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ),
    [openMenu, friendsRequest, isAuth]
  );
};

export default Header;
