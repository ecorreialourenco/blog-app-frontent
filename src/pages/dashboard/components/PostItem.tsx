import { Grid, Tooltip } from "@mui/material";
import { FC } from "react";
import Button from "../../../components/button/Button";
import { PostModel } from "../../../models/post.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScrewdriverWrench,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@apollo/client";
import { DELETE_POST } from "../../../queries/post";

import "./PostItem.scss";

interface PostItemProps {
  item: PostModel;
  handleUpdate: (item: PostModel) => void;
}

const PostItem: FC<PostItemProps> = (props) => {
  const { id, title, text } = props.item;

  const [deletePost] = useMutation(DELETE_POST);

  const handleDelete = () => {
    deletePost({ variables: { id } });
  };

  return (
    <Grid container className="post-item--container">
      <Grid item xs={12} md={8}>
        <h3>{title}</h3>
      </Grid>
      <Grid item xs={12} md={4} className="post-item--actions">
        <Tooltip title="Edit">
          <FontAwesomeIcon
            icon={faScrewdriverWrench}
            onClick={() => props.handleUpdate(props.item)}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete()} />
        </Tooltip>
      </Grid>

      <Grid item xs={12}>
        <span style={{ textAlign: "left" }}>{text}</span>
      </Grid>
    </Grid>
  );
};

export default PostItem;
