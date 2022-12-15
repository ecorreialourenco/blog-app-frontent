import { FC } from "react";
import {
  faUserCheck,
  faUserPlus,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Grid,
  Tooltip,
} from "@mui/material";
import { Status } from "../../../../enum/status.enum";
import { Friend, User } from "../../../../models/profile.model";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { useMutation } from "@apollo/client";
import { ADD_FRIEND, UPDATE_FRIEND } from "../../../../queries/users";
import "./UserItem.scss";

interface UserItemProps {
  item: User;
  handleAddFriend?: (id: number) => void;
  handleUpdateFriend?: (id: number, status: Status) => void;
}

const UserItem: FC<UserItemProps> = (props) => {
  const { item } = props;
  const { user } = useSelector((state: RootState) => state.auth);
  const { id, username, email, image, friend } = item;

  const [addFriend] = useMutation(ADD_FRIEND);
  const [updateFriend] = useMutation(UPDATE_FRIEND);

  const handleAddFriend = (targetId: number) => {
    addFriend({
      variables: {
        requestId: user?.id,
        targetId,
      },
    });
  };

  const handleUpdateFriend = (id: number, status: Status) => {
    updateFriend({ variables: { id, status } });
  };

  const renderOptions = (args: Friend) => {
    const { id, targetUserId, status } = args;
    switch (status) {
      case Status.PENDING:
        if (targetUserId === user?.id) {
          // Can accept friendship or remove
          return (
            <>
              <Tooltip title="Acept friend">
                <FontAwesomeIcon
                  icon={faUserCheck}
                  onClick={() => handleUpdateFriend(id, Status.ACEPT)}
                />
              </Tooltip>
              <Tooltip title="Reject friend">
                <FontAwesomeIcon
                  icon={faUserSlash}
                  onClick={() => handleUpdateFriend(id, Status.DENIED)}
                />
              </Tooltip>
              <Tooltip title="Block user">
                <FontAwesomeIcon
                  icon={faUserSlash}
                  onClick={() => handleUpdateFriend(id, Status.DENIED)}
                />
              </Tooltip>
            </>
          );
        } else {
          // Can cancel friendshipt request
          return (
            <Tooltip title="Cancel request">
              <FontAwesomeIcon
                icon={faUserSlash}
                onClick={() => handleUpdateFriend(id, Status.NONE)}
              />
            </Tooltip>
          );
        }

      case Status.ACEPT:
        // Remove friendship
        return (
          <>
            <Tooltip title="Remove friend">
              <FontAwesomeIcon
                icon={faUserSlash}
                onClick={() => handleUpdateFriend(id, Status.NONE)}
              />
            </Tooltip>
          </>
        );

      default:
        // No friendship connection
        return (
          <Tooltip title="Add friend">
            <FontAwesomeIcon
              icon={faUserPlus}
              onClick={() => handleAddFriend(targetUserId)}
            />
          </Tooltip>
        );
    }
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={2} key={id}>
      <Card className={`users-item-card `}>
        <CardHeader title={username || email} />
        <CardMedia component="img" height="150" image={image} />
        <CardActions disableSpacing className="users-item-actions">
          {friend ? (
            renderOptions(friend)
          ) : (
            <Tooltip title="Add friend">
              <FontAwesomeIcon
                icon={faUserPlus}
                onClick={() => handleAddFriend(id)}
              />
            </Tooltip>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
};

export default UserItem;
