import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Avatar, Menu, MenuItem, Tooltip } from "@mui/material";
import { setAuth } from "../../store/slices/auth";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import "./Header.scss";

const Header: FC = () => {
  const { isAuth, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleClickAvatar = (event: any) => {
    setOpenMenu(true);
    setAnchorEl(event.currentTarget);
  };

  const handleNavigate = (location: string) => {
    navigate(location);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setAuth(null));
  };

  return (
    <header className="header">
      <div className="header-left-side}">
        <Link to="/" className="header-left-link">
          <span>Blog APP</span>
        </Link>
      </div>
      <div className="header-right-side">
        {isAuth ? (
          <>
            <Tooltip title="My blog">
              <FontAwesomeIcon
                icon={faComments}
                className="header-icons"
                onClick={() => handleNavigate("/blog")}
              />
            </Tooltip>
            {user?.image ? (
              <Avatar src={user.image} onClick={handleClickAvatar} />
            ) : (
              <Avatar onClick={handleClickAvatar}>
                {user?.username ? user.username : "U"}
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
  );
};

export default Header;
