import { Grid } from "@mui/material";
import { FC } from "react";

interface PostHeaderProps {
  canChange: boolean;
  selfPost: boolean;
  me?: boolean;
  username: string;
  title: string;
  date: string;
  children?: React.ReactNode;
}

const PostHeader: FC<PostHeaderProps> = (props) => {
  const { canChange, me, selfPost, username, title, date, children } = props;

  return (
    <>
      <Grid item xs={12} md={canChange ? 8 : 12} className="post-header">
        <h3>{title}</h3>
        {me && selfPost ? (
          <span>Me - {date}</span>
        ) : !selfPost ? (
          <span>
            {username} - {date}
          </span>
        ) : (
          <span>{date}</span>
        )}
      </Grid>
      {canChange && children}
    </>
  );
};

export default PostHeader;
