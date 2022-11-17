import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const Dashboard: FC = () => {
  const { isAuth } = useSelector((state: RootState) => state.auth);

  return <div>{isAuth ? <span>Auth</span> : <span>Guest</span>}</div>;
};

export default Dashboard;
