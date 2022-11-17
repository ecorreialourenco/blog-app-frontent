import { Grid } from "@mui/material";
import { FC, useEffect, useState } from "react";
import Button from "../../components/button/Button";
import { useLazyQuery, useSubscription } from "@apollo/client";
import {
  CREATE_POST_SUBSCRIPTION,
  UPDATE_POST_SUBSCRIPTION,
  DELETE_POST_SUBSCRIPTION,
  LIST_POST,
} from "../../queries/post";
import CreatePostModal from "./components/PostModal";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { PostModel } from "../../models/post.model";
import PostItem from "./components/PostItem";

const Dashboard: FC = () => {
  const [userId, setUserId] = useState<number>(0);
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [updatePost, setUpdatePost] = useState<PostModel | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const [listPosts, { data: postData }] = useLazyQuery(LIST_POST, {
    variables: { userId },
  });

  const { data: dataCreatePost } = useSubscription(CREATE_POST_SUBSCRIPTION, {
    variables: { userId },
  });
  const { data: dataUpdatePost } = useSubscription(UPDATE_POST_SUBSCRIPTION, {
    variables: { userId },
  });
  const { data: dataDeletePost } = useSubscription(DELETE_POST_SUBSCRIPTION, {
    variables: { userId },
  });
  const handleUpdate = (val: PostModel) => {
    setUpdatePost(val);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setUpdatePost(null);
  };

  useEffect(() => {
    if (!!user) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    !!userId && listPosts({ variables: { userId } });
  }, [userId]);

  useEffect(() => {
    if (postData) {
      setPosts(postData.listPosts);
    }
  }, [postData]);

  useEffect(() => {
    if (dataCreatePost) {
      const newPost: PostModel[] = [];
      newPost.push(dataCreatePost.postCreated);
      newPost.push(...posts);

      setPosts(newPost);
    }
  }, [dataCreatePost]);

  useEffect(() => {
    if (dataUpdatePost) {
      const index = posts.findIndex(
        (item: PostModel) => item.id === dataUpdatePost.postUpdated.id
      );
      const updatedPosts = [...posts];
      updatedPosts[index].title = dataUpdatePost.postUpdated.title;
      updatedPosts[index].text = dataUpdatePost.postUpdated.text;

      setPosts(updatedPosts);
    }
  }, [dataUpdatePost]);

  useEffect(() => {
    if (dataDeletePost) {
      const index = posts.findIndex(
        (item: PostModel) => item.id === dataDeletePost.postDeleted.id
      );
      const updatedPosts = [...posts];

      updatedPosts.splice(index, 1);

      setPosts(updatedPosts);
    }
  }, [dataDeletePost]);

  return (
    <div>
      <Grid container justifyContent="center">
        <Grid item xs={12} className="title">
          <h1>Blog</h1>

          <Button label="New Post" onClick={() => setModalOpen(true)} />
        </Grid>
        {posts.map((item: PostModel) => (
          <PostItem
            key={item.id}
            item={item}
            handleUpdate={(val) => {
              handleUpdate(val);
            }}
          />
        ))}
      </Grid>
      <CreatePostModal
        item={updatePost}
        open={modalOpen}
        handleClose={handleClose}
      />
    </div>
  );
};

export default Dashboard;
