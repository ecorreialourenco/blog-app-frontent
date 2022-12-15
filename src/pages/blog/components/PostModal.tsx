import { useMutation } from "@apollo/client";
import { Dialog, DialogTitle, Grid } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "../../../components/button/Button";
import Input from "../../../components/form/input/Input";
import { PostModel } from "../../../models/post.model";
import { CREATE_POST, UPDATE_POST } from "../../../queries/post";
import { RootState } from "../../../store/store";
import "./PostModal.scss";

interface CreateModalProps {
  item?: PostModel | null;
  open: boolean;
  handleClose: () => void;
}

const CreatePostModal: FC<CreateModalProps> = (props) => {
  const { item, open, handleClose } = props;
  const [id, setId] = useState<number | null>();
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const { user } = useSelector((state: RootState) => state.auth);

  const [createPost] = useMutation(CREATE_POST);
  const [updatePost] = useMutation(UPDATE_POST);

  const sendPost = () => {
    if (id) {
      updatePost({
        variables: {
          id,
          title,
          text,
        },
      });
    } else {
      createPost({
        variables: {
          userId: user?.id,
          title,
          text,
        },
      });
      setTitle("");
      setText("");
    }

    handleClose();
  };

  useEffect(() => {
    if (item) {
      setId(item.id);
      setText(item.text);
      setTitle(item.title);
    } else {
      setId(null);
      setText("");
      setTitle("");
    }
  }, [item]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogTitle>{id ? "Update Post" : "New Post"}</DialogTitle>
      <Grid container justifyContent="center">
        <Input
          label="Title"
          name="title"
          xs={12}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="Text"
          name="text"
          xs={12}
          value={text}
          lines={4}
          onChange={(e) => setText(e.target.value)}
        />
        <Grid item xs={4} className="col col-button">
          <Button
            label={id ? "Update" : "Create"}
            onClick={sendPost}
            disabled={!title.length || !text.length}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default CreatePostModal;
