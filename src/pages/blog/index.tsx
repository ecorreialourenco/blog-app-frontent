import { CircularProgress, Grid, Tooltip } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useLazyQuery, useSubscription } from "@apollo/client";
import {
  CREATE_POST_SUBSCRIPTION,
  UPDATE_POST_SUBSCRIPTION,
  DELETE_POST_SUBSCRIPTION,
  LIST_POST,
} from "../../queries/post";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { PostModel } from "../../models/post.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import CreatePostModal from "./components/PostModal";
import PostItem from "./components/PostItem";
import Pagination from "../../components/form/Pagination";
import "./Blog.scss";

const Blog: FC = () => {
  const [userId, setUserId] = useState<number>(0);
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [updatePost, setUpdatePost] = useState<PostModel | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const [listPosts, { loading, data: postData }] = useLazyQuery(LIST_POST);

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

  const handleChangePage = (newPage: number) => {
    user && listPosts({ variables: { userId, page: newPage } });
    setPage(newPage);
  };

  useEffect(() => {
    if (!!user) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    !!userId && listPosts({ variables: { userId, page } });
  }, [userId]);

  useEffect(() => {
    if (postData && postData.listPosts) {
      const { posts: userPosts, totalPages } = postData.listPosts;
      setPosts(userPosts);
      setTotal(totalPages);
    }
  }, [postData]);

  useEffect(() => {
    if (dataCreatePost && page === 0) {
      const { post: newUserPost, totalPages } = dataCreatePost.postCreated;
      const newPost: PostModel[] = [];
      newPost.push(newUserPost);
      newPost.push(...posts);

      if (totalPages > total) {
        newPost.pop();
        setTotal(totalPages);
      }

      setPosts(newPost);
    }
  }, [dataCreatePost]);

  useEffect(() => {
    if (dataUpdatePost) {
      const { post: updatedUserPost } = dataUpdatePost.postUpdated;

      const index = posts.findIndex(
        (item: PostModel) => item.id === updatedUserPost.id
      );
      if (index !== -1) {
        const updatedPosts = [...posts];
        updatedPosts[index].title = updatedUserPost.title;
        updatedPosts[index].text = updatedUserPost.text;

        setPosts(updatedPosts);
      }
    }
  }, [dataUpdatePost]);

  useEffect(() => {
    if (dataDeletePost) {
      const index = posts.findIndex(
        (item: PostModel) => item.id === dataDeletePost.postDeleted.id
      );

      if (index !== -1) {
        const updatedPosts = [...posts];
        updatedPosts.splice(index, 1);

        setPosts(updatedPosts);
      }

      dataDeletePost.totalPages < total && setTotal(dataDeletePost.totalPages);
    }
  }, [dataDeletePost]);

  return (
    <div>
      <Grid container justifyContent="center" className="blog-container">
        <Grid item xs={12} className="title">
          <h1>
            Blog{" "}
            <Tooltip title="New post">
              <FontAwesomeIcon
                className="blog-icon"
                icon={faPlusCircle}
                onClick={() => setModalOpen(true)}
              />
            </Tooltip>
          </h1>
        </Grid>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid item xs={12} className="blog-list" p={4}>
            {posts.map((item: PostModel) => (
              <PostItem
                key={item.id}
                item={item}
                handleUpdate={(val: any) => {
                  handleUpdate(val);
                }}
                canChange={true}
              />
            ))}
            <Pagination
              total={total}
              page={page}
              handleChangePage={handleChangePage}
            />
          </Grid>
        )}
      </Grid>
      <CreatePostModal
        item={updatePost}
        open={modalOpen}
        handleClose={handleClose}
      />
    </div>
  );
};

export default Blog;
