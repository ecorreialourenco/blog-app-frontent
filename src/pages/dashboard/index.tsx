import { FC, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useLazyQuery, useSubscription } from "@apollo/client";

import "./Dashboard.scss";
import { LIST_FRIENDS_POSTS } from "../../queries/dashboard";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { PostModel } from "../../models/post.model";
import PostItem from "../blog/components/PostItem";

const Dashboard: FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [list, setList] = useState<PostModel[]>([]);
  const [listPosts, { loading, data }] = useLazyQuery(LIST_FRIENDS_POSTS);

  useEffect(() => {
    listPosts({ variables: { userId: user?.id } });
  }, []);

  useEffect(() => {
    if (data && data.listFriendsPosts) {
      setList(data.listFriendsPosts);
    }
  }, [data]);

  return (
    <div>
      <Grid container justifyContent="center">
        <Grid item xs={12} className="title">
          <h1>Dashboard</h1>
        </Grid>

        <Grid item xs={12} className="post-container" p={4}>
          {list.map((item: PostModel) => (
            <PostItem
              key={item.id}
              item={item}
              me={true}
              user={item.user}
              handleUpdate={() => {}}
              canChange={false}
            />
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
