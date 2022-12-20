import { Grid, Pagination as MPagination } from "@mui/material";
import { FC } from "react";
import "./Pagination.scss";

interface PaginationProps {
  total: number;
  page: number;
  handleChangePage: (page: number) => void;
}

const Pagination: FC<PaginationProps> = (props) => {
  const { total, page, handleChangePage } = props;

  return (
    <Grid item xs={12} className="pagination pagination-container">
      {total > 1 && (
        <MPagination
          count={total}
          showFirstButton
          showLastButton
          page={page + 1}
          onChange={(event: React.ChangeEvent<unknown>, value: number) =>
            handleChangePage(value - 1)
          }
        />
      )}
    </Grid>
  );
};

export default Pagination;
