import { FC, useEffect, useState } from "react";
import { useLazyQuery, useSubscription } from "@apollo/client";
import {
  CREATE_USER_SUBSCRIPTION,
  LIST_USERS,
  UPDATE_FRIEND_SUBSCRIPTION,
  UPDATE_USER_SUBSCRIPTION,
} from "../../../../queries/users";
import { Friend, User } from "../../../../models/profile.model";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { setToken } from "../../../../helpers/setToken";
import List from "../common/List";
import "./UserList.scss";

const UserList: FC = () => {
  const [list, setList] = useState<User[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const dispatch = useDispatch();

  const [listUsers, { data }] = useLazyQuery(LIST_USERS);

  const { data: dataUserCreated } = useSubscription(CREATE_USER_SUBSCRIPTION);
  const { data: dataUserUpdated } = useSubscription(UPDATE_USER_SUBSCRIPTION);
  const { data: dataFriendChanged } = useSubscription(
    UPDATE_FRIEND_SUBSCRIPTION,
    {
      variables: { userId: user?.id },
    }
  );

  const updateList = (currentPage: number, searchString: string) => {
    user &&
      listUsers({
        variables: {
          excludeId: user.id,
          page: currentPage,
          search: searchString,
        },
        fetchPolicy: "network-only",
      });
  };

  const handleChangePage = (newPage: number) => {
    updateList(newPage, search);
    setPage(newPage);
  };

  const handleChangeSearch = (val: string) => {
    updateList(page, val);
    setSearch(val);
  };

  useEffect(() => {
    updateList(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data && data.listUsers) {
      const { users, totalPages } = data.listUsers;
      setList(users);
      total !== totalPages && setTotal(totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  useEffect(() => {
    // New user registered
    // Get updated list
    !!dataUserCreated && updateList(page, search);
  }, [dataUserCreated]);

  useEffect(() => {
    if (dataUserUpdated) {
      // Check if the updated user are in the current list
      const index = list.findIndex(
        (item: User) => item.id === dataUserUpdated.userUpdated.id
      );

      if (index > -1) {
        const updatedFriend = [...list];
        updatedFriend[index].email = dataUserUpdated.userUpdated.email;
        updatedFriend[index].username = dataUserUpdated.userUpdated.username;
        setList(updatedFriend);
      }
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

  return (
    <List
      list={list}
      total={total}
      currentPage={page}
      handleChangePage={handleChangePage}
      handleChangeSearch={handleChangeSearch}
    />
  );
};

export default UserList;
