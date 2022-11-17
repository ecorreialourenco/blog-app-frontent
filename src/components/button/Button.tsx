import { FC } from "react";
import { Button as MatBUtton } from "@mui/material";
import "./Button.scss";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

const Button: FC<ButtonProps> = (props) => {
  const { onClick, disabled, label } = props;

  return (
    <MatBUtton disabled={disabled} className="button" onClick={onClick}>
      {label}
    </MatBUtton>
  );
};

export default Button;
