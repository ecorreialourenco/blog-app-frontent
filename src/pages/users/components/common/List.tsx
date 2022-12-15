import { Grid } from "@mui/material";
import { FC } from "react";
import Pagination from "../../../../components/form/Pagination";
import { User } from "../../../../models/profile.model";
import UserItem from "./UserItem";
import { v4 as uuidv4 } from "uuid";
import "./List.scss";
import Search from "./Search";

interface ListProps {
  list: User[];
  total: number;
  currentPage: number;
  handleChangePage: (newPage: number) => void;
  handleChangeSearch: (search: string) => void;
}

const List: FC<ListProps> = (props) => {
  const { list, total, currentPage, handleChangePage, handleChangeSearch } =
    props;

  return (
    <div className="list-container">
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} className="list-search-container">
          <Search label="Search User" onChange={handleChangeSearch} />
        </Grid>
      </Grid>
      <Grid container justifyContent="center" spacing={2}>
        {list.map((userItem: User) => (
          <UserItem key={uuidv4()} item={userItem} />
        ))}
        <Pagination
          total={total}
          page={currentPage + 1}
          handleChangePage={handleChangePage}
        />
      </Grid>
    </div>
  );
};

export default List;
