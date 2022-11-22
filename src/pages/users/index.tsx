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
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import {
  ADD_FRIEND,
  CREATE_USER_SUBSCRIPTION,
  LIST_USERS,
  UPDATE_FRIEND,
  UPDATE_FRIEND_SUBSCRIPTION,
  UPDATE_USER_SUBSCRIPTION,
} from "../../queries/users";
import { Friend, User } from "../../models/profile.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faUserCheck,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "./Users.scss";
import { Status } from "../../enum/status.enum";
import { setToken } from "../../helpers/setToken";

const Users: FC = () => {
  const [list, setList] = useState<User[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [listUsers, { loading, data }] = useLazyQuery(LIST_USERS);
  const [addFriend] = useMutation(ADD_FRIEND);
  const [updateFriend] = useMutation(UPDATE_FRIEND);

  const { data: dataUserCreated } = useSubscription(CREATE_USER_SUBSCRIPTION);
  const { data: dataUserUpdated } = useSubscription(UPDATE_USER_SUBSCRIPTION);
  const { data: dataFriendChanged } = useSubscription(
    UPDATE_FRIEND_SUBSCRIPTION,
    {
      variables: { userId: user?.id },
    }
  );

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

  const getCardClassName = (status: Status, requestUserId: number) => {
    switch (status) {
      case Status.ACEPT:
        return "users-item-friend";
      case Status.DENIED:
        return requestUserId !== user!.id ? "users-item-block" : "";
      case Status.PENDING:
        return "users-item-pending";
      default:
        return "";
    }
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

  useEffect(() => {
    if (dataUserCreated) {
      const newUser: User[] = [];
      newUser.push(dataUserCreated.userCreated);
      newUser.push(...list);

      setList(newUser);
    }
  }, [dataUserCreated]);

  useEffect(() => {
    if (dataUserUpdated) {
      const index = list.findIndex(
        (item: User) => item.id === dataUserUpdated.userUpdated.id
      );
      const updatedFriend = [...list];
      updatedFriend[index].email = dataUserUpdated.userUpdated.email;
      updatedFriend[index].username = dataUserUpdated.userUpdated.username;

      setList(updatedFriend);
    }
  }, [dataUserUpdated]);

  useEffect(() => {
    if (dataFriendChanged && dataFriendChanged.friendsChange && !!user) {
      const { friend, action } = dataFriendChanged.friendsChange;
      const { requestUserId, targetUserId } = friend;
      const friendId = requestUserId !== user.id ? requestUserId : targetUserId;

      setList(
        list.map((item) => {
          if (item.id === friendId && action !== "delete") {
            return { ...item, friend };
          } else if (item.id === friendId) {
            return { ...item, friend: null };
          }
          return item;
        })
      );
    }
  }, [dataFriendChanged]);

  useEffect(() => {
    // update user friend list
    if (user) {
      const userFriends: Friend[] = user.friends!;
      const friendsList: User[] = list.filter((item: User) => item.friend);

      const updateFriendsList =
        JSON.stringify(userFriends) !== JSON.stringify(friendsList);

      if (updateFriendsList) {
        if (friendsList.length) {
          const newFriends: Friend[] = friendsList.map(
            (item: User) => item.friend!
          );

          const updatedUserData: User = { ...user, friends: newFriends };
          setToken({ data: updatedUserData, dispatch });
        } else {
          // Clear friends list
          const updatedUserData: User = { ...user, friends: [] };
          setToken({ data: updatedUserData, dispatch });
        }
      }
    }
  }, [list]);

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
                const cardClassName = !!friend
                  ? getCardClassName(friend.status, friend.requestUserId)
                  : "";

                return (
                  <Grid item xs={12} sm={6} md={4} lg={2} key={id}>
                    <Card className={`users-item-card ${cardClassName}`}>
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
