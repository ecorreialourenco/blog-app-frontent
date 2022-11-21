import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CircularProgress,
  Grid,
  Tooltip,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { ADD_FRIEND, LIST_USERS, UPDATE_FRIEND } from "../../queries/users";
import { Friend, User } from "../../models/profile.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faUserCheck,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "./Users.scss";
import { Status } from "../../enum/status.enum";

const Users: FC = () => {
  const [list, setList] = useState<User[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);

  const [listUsers, { loading, data }] = useLazyQuery(LIST_USERS);
  const [addFriend] = useMutation(ADD_FRIEND);
  const [updateFriend] = useMutation(UPDATE_FRIEND);

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
              <Tooltip title="Deny friend">
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
                onClick={() => handleUpdateFriend(id, Status.DENIED)}
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

  useEffect(() => {
    user && listUsers({ variables: { excludeId: user.id } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data && data.listUsers) {
      setList(data.listUsers);
    }
  }, [data]);

  return (
    <div>
      <Grid container justifyContent="center">
        <Grid item xs={12} className="title">
          <h1>Users</h1>
        </Grid>
        <Grid item xs={12}>
          {loading ? (
            <div className="users-loading">
              <CircularProgress />
            </div>
          ) : (
            <Grid container justifyContent="center" spacing={2}>
              {list.map((userItem: User) => {
                const { id, username, email, image, friend } = userItem;

                return (
                  <Grid item xs={12} sm={6} md={4} lg={2} key={id}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardHeader title={username || email} />
                      <CardMedia component="img" height="150" image={image} />
                      <CardActions disableSpacing>
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
              })}
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Users;
