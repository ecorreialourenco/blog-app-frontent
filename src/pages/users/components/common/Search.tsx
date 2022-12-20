import { FC } from "react";
import { TextField } from "@mui/material";
import debounce from "lodash/debounce";
import "./Search.scss";

interface SearchProps {
  label: string;
  onChange: (search: string) => void;
}

const Search: FC<SearchProps> = (props) => {
  const { label, onChange } = props;

  const debouncedSearch = debounce((val: string) => {
    onChange(val);
  }, 1000);

  const handleChange = (e: any) => {
    debouncedSearch(e.target.value);
  };

  return (
    <TextField
      label={label}
      variant="outlined"
      className="search"
      onChange={handleChange}
    />
  );
};

export default Search;
