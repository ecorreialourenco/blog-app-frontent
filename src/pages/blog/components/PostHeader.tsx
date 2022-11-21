import { Grid } from "@mui/material";
import { FC } from "react";

interface PostHeaderProps {
  canChange: boolean;
  selfPost: boolean;
  username: string;
  title: string;
  date: string;
  children?: React.ReactNode;
}

const PostHeader: FC<PostHeaderProps> = (props) => {
  const { canChange, selfPost, username, title, date, children } = props;

  return (
    <>
      <Grid item xs={12} md={canChange ? 8 : 12} className="post-header">
        <h3>{title}</h3>
        {!selfPost ? (
          <h4>
            <>
              {username} - {date}
            </>
          </h4>
        ) : (
          <span>{date}</span>
        )}
      </Grid>
      {canChange && children}
    </>
  );
};

export default PostHeader;
