import { Grid, Tooltip } from "@mui/material";
import { FC } from "react";
import { PostModel } from "../../../models/post.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScrewdriverWrench,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@apollo/client";
import { DELETE_POST } from "../../../queries/post";
import { User } from "../../../models/profile.model";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import PostHeader from "./PostHeader";
import "./PostItem.scss";

interface PostItemProps {
  item: PostModel;
  user?: User;
  me?: boolean;
  handleUpdate: (item: PostModel) => void;
  canChange: boolean;
  withLink?: boolean;
}

const PostItem: FC<PostItemProps> = (props) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { item, handleUpdate, canChange, withLink, me } = props;
  const { id, title, text, createdAt } = item;
  const selfPost = !props.user || user?.id === props.user.id;
  const createdDate = new Date(parseInt(createdAt));
  const username: string =
    props.user && props.user.username ? props.user.username : "";

  const [deletePost] = useMutation(DELETE_POST);

  const handleDelete = () => {
    deletePost({ variables: { id } });
  };

  return (
    <Grid container className="post-item--container">
      <PostHeader
        canChange={canChange}
        selfPost={selfPost}
        me={me}
        date={createdDate.toLocaleDateString()}
        title={title}
        username={username}
        withLink={withLink}
        userId={!!props.user ? props.user.id : user?.id}
      >
        <Grid item xs={12} md={4} className="post-item--actions">
          <Tooltip title="Edit">
            <FontAwesomeIcon
              className="post-item--icon"
              icon={faScrewdriverWrench}
              onClick={() => handleUpdate(item)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <FontAwesomeIcon
              className="post-item--icon"
              icon={faTrashCan}
              onClick={() => handleDelete()}
            />
          </Tooltip>
        </Grid>
      </PostHeader>

      <Grid item xs={12} className="post-item--text">
        <span style={{ textAlign: "left" }}>{text}</span>
      </Grid>
    </Grid>
  );
};

export default PostItem;
