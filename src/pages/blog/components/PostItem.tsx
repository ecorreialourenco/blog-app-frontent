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

import "./PostItem.scss";
import { User } from "../../../models/profile.model";

interface PostItemProps {
  item: PostModel;
  user?: User;
  handleUpdate: (item: PostModel) => void;
  canChange: boolean;
}

const PostItem: FC<PostItemProps> = (props) => {
  const { item, handleUpdate, canChange } = props;
  const { id, title, text } = item;

  const [deletePost] = useMutation(DELETE_POST);

  const handleDelete = () => {
    deletePost({ variables: { id } });
  };

  return (
    <Grid container className="post-item--container">
      <Grid item xs={12} md={canChange ? 8 : 12} className="post-item--title">
        <h3>{title}</h3>
      </Grid>
      {canChange && (
        <Grid item xs={12} md={4} className="post-item--actions">
          <Tooltip title="Edit">
            <FontAwesomeIcon
              icon={faScrewdriverWrench}
              onClick={() => handleUpdate(item)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete()} />
          </Tooltip>
        </Grid>
      )}

      <Grid item xs={12} className="post-item--text">
        <span style={{ textAlign: "left" }}>{text}</span>
      </Grid>
    </Grid>
  );
};

export default PostItem;
