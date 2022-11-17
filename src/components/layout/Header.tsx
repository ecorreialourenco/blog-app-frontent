import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { setAuth } from "../../store/slices/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";

const Header: FC = () => {
  const { auth } = useSelector((state: RootState) => state);
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
        {auth.isAuth ? (
          <>
            <Avatar onClick={handleClickAvatar}>H</Avatar>
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
