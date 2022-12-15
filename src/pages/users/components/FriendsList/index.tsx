import { FC, useEffect, useState } from "react";
import { useLazyQuery, useSubscription } from "@apollo/client";
import {
  LIST_FRIENDS,
  UPDATE_FRIEND_SUBSCRIPTION,
} from "../../../../queries/users";
import { Friend, User } from "../../../../models/profile.model";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { setToken } from "../../../../helpers/setToken";
import List from "../common/List";
import { Status } from "../../../../enum/status.enum";
import { UserQueryVariables } from "../../../../models/queries.model";
import "./FriendsList.scss";

interface FriendsListProps {
  currentStatus: Status[];
}

const FriendsList: FC<FriendsListProps> = (props) => {
  const { currentStatus } = props;
  const [list, setList] = useState<User[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const dispatch = useDispatch();

  const [listFriends, { data }] = useLazyQuery(LIST_FRIENDS);

  const { data: dataFriendChanged } = useSubscription(
    UPDATE_FRIEND_SUBSCRIPTION,
    {
      variables: { userId: user?.id },
    }
  );
  
  const updateList = (currentPage: number, searchString: string) => {
    let variables: UserQueryVariables = {
      excludeId: user ? user.id : 0,
      page: currentPage,
      search: searchString,
      statusIn: currentStatus,
    };

    listFriends({ variables, fetchPolicy: "network-only" });
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
    if (data && data.listFriends) {
      const { users, totalPages } = data.listFriends;
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
    if (dataFriendChanged && dataFriendChanged.friendsChange && !!user) {
      const { friend, action } = dataFriendChanged.friendsChange;

      if (action === "delete") {
        const { requestUserId, targetUserId } = friend;
        const friendId =
          requestUserId !== user.id ? requestUserId : targetUserId;
        // Check if the user are in the list
        const index = list.findIndex((item: User) => item.id === friendId);

        if (index > -1) {
          // Remove element from the list
          let newList = [...list];
          newList.splice(index, 1);
          setList(newList);
        }
      } else {
        // Get new list
        updateList(page, search);
      }
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

export default FriendsList;
