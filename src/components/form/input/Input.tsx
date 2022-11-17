import { FC } from "react";
import { TextField, Grid } from "@mui/material";
import styles from "./Input.module.scss";

interface InputProps {
  label: string;
  name: string;
  value: any;
  xs: number;
  sm?: number;
  md?: number;
  lg?: number;
  onChange: (e: any) => void;
  readOnly?: boolean;
}

const Input: FC<InputProps> = (props) => {
  const { label, name, value, xs, sm, md, lg, onChange, readOnly } = props;

  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg} className={styles.col}>
      <TextField
        label={label}
        variant="outlined"
        name={name}
        value={value}
        className={styles.input}
        onChange={(e) => onChange(e)}
        autoComplete={`current-${name}`}
        InputProps={{
          readOnly,
        }}
      />
    </Grid>
  );
};

export default Input;
