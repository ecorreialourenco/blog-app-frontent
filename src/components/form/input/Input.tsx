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
  lines?: number;
}

const Input: FC<InputProps> = (props) => {
  const { label, name, value, xs, sm, md, lg, onChange, readOnly, lines } =
    props;
  console.log("🚀 ~ file: Input.tsx ~ line 20 ~ value", value);
  console.log("🚀 ~ file: Input.tsx ~ line 20 ~ name", name);

  const multiline = !!lines && lines > 1;
  const rows = !!lines && lines > 1 ? lines : 1;

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
        multiline={multiline}
        rows={rows}
        InputProps={{
          readOnly,
        }}
      />
    </Grid>
  );
};

export default Input;
