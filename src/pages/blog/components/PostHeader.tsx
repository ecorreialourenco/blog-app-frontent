import { Grid } from "@mui/material";
import { FC } from "react";
import "./PostHeader.scss";

interface PostHeaderProps {
  canChange: boolean;
  selfPost: boolean;
  me?: boolean;
  username: string;
  title: string;
  date: string;
  children?: React.ReactNode;
  withLink?: boolean;
  userId?: number;
}

const PostHeader: FC<PostHeaderProps> = (props) => {
  const {
    canChange,
    me,
    selfPost,
    username,
    title,
    date,
    withLink,
    userId,
    children,
  } = props;

  const postOrigin =
    me && selfPost
      ? `Me - ${date}`
      : !selfPost
      ? `${username} - ${date}`
      : date;

  return (
    <>
      <Grid item xs={12} md={canChange ? 8 : 12} className="post-header">
        <span className="post-header-title">{title}</span>
        <span className="post-header-origin">
          {withLink ? (
            <a href={`/posts/${userId}`}>{postOrigin}</a>
          ) : (
            postOrigin
          )}
        </span>
      </Grid>
      {canChange && children}
    </>
  );
};

export default PostHeader;
