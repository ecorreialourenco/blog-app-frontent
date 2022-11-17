import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Blog from "../pages/blog";
import Dashboard from "../pages/dashboard";
import Profile from "../pages/profile";

const AuthRouter: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="blog" element={<Blog />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AuthRouter;
