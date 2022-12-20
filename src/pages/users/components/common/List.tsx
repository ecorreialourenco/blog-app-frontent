import { Grid } from "@mui/material";
import { FC } from "react";
import Pagination from "../../../../components/form/Pagination";
import { User } from "../../../../models/profile.model";
import UserItem from "./UserItem";
import { v4 as uuidv4 } from "uuid";
import Search from "./Search";
import "./List.scss";

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
    <div className="list">
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} className="list-search-container">
          <Search label="Search User" onChange={handleChangeSearch} />
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent="center"
        spacing={2}
        className="list list-container"
      >
        {list.map((userItem: User) => (
          <UserItem key={uuidv4()} item={userItem} />
        ))}
      </Grid>
      <Grid
        container
        justifyContent="center"
        spacing={2}
        className="list-container"
      >
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
