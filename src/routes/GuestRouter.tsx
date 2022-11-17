import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import GuestDashboard from "../pages/dashboard";
import Login from "../pages/login";
import RecoverPassword from "../pages/recoverPassword";
import Signup from "../pages/signup";

const GuestRouter: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<GuestDashboard />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="recover" element={<RecoverPassword />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default GuestRouter;
