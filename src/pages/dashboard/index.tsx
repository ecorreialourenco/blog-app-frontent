import { FC, useEffect, useState } from "react";
import { CircularProgress, Grid } from "@mui/material";
import { useLazyQuery /* , useSubscription */ } from "@apollo/client";
import { LIST_FRIENDS_POSTS } from "../../queries/dashboard";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { PostModel } from "../../models/post.model";
import PostItem from "../blog/components/PostItem";
import Pagination from "../../components/form/Pagination";
import "./Dashboard.scss";

const Dashboard: FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [list, setList] = useState<PostModel[]>([]);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [listPosts, { loading, data }] = useLazyQuery(LIST_FRIENDS_POSTS);

  const handleChangePage = (newPage: number) => {
    user && listPosts({ variables: { userId: user.id, page: newPage } });
    setPage(newPage);
  };

  useEffect(() => {
    listPosts({ variables: { userId: user?.id, page } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data && data.listFriendsPosts) {
      const { posts, totalPages } = data.listFriendsPosts;
      setList(posts);
      setTotal(totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Grid container justifyContent="center" className="dashboard-container">
      <Grid item xs={12} className="title">
        <h1>Dashboard</h1>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid
            item
            xs={12}
            className="dashboard-container dashboard-container--list"
            p={4}
          >
            {list.map((item: PostModel) => (
              <PostItem
                key={item.id}
                item={item}
                me={true}
                user={item.user}
                handleUpdate={() => {}}
                canChange={false}
                withLink={true}
              />
            ))}
          </Grid>
          <Grid
            item
            xs={12}
            className="dashboard-container dashboard-container--pagination"
            p={4}
          >
            <Pagination
              total={total}
              page={page}
              handleChangePage={handleChangePage}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Dashboard;
