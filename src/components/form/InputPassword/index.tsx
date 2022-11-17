import { FC } from "react";
import { TextField, Grid } from "@mui/material";
import styles from "./InputPassword.module.scss";

interface InputPasswordProps {
  label: string;
  name: string;
  value: any;
  xs: number;
  sm?: number;
  md?: number;
  lg?: number;
  onChange: (e: any) => void;
}

const InputPassword: FC<InputPasswordProps> = (props) => {
  const { label, name, value, xs, sm, md, lg, onChange } = props;

  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg} className={styles.col}>
      <TextField
        label={label}
        variant="outlined"
        type="password"
        name={name}
        value={value}
        className={styles.input}
        onChange={(e) => onChange(e)}
        autoComplete="current-password"
      />
    </Grid>
  );
};

export default InputPassword;
