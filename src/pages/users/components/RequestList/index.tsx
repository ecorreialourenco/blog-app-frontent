import { FC, useEffect, useState } from "react";
import { useLazyQuery, useSubscription } from "@apollo/client";
import {
  LIST_REQUESTS,
  UPDATE_FRIEND_SUBSCRIPTION,
} from "../../../../queries/users";
import { Friend, User } from "../../../../models/profile.model";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { setToken } from "../../../../helpers/setToken";
import List from "../common/List";
import "./RequestList.scss";
import { UserRequestQueryVariables } from "../../../../models/queries.model";

interface RequestListProps {
  isOwn: boolean;
}

const RequestList: FC<RequestListProps> = (props) => {
  const { isOwn } = props;
  const [list, setList] = useState<User[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const dispatch = useDispatch();

  const [listRequests, { data }] = useLazyQuery(LIST_REQUESTS);

  const { data: dataFriendChanged } = useSubscription(
    UPDATE_FRIEND_SUBSCRIPTION,
    {
      variables: { userId: user?.id },
    }
  );

  const updateList = (currentPage: number, searchString: string) => {
    let variables: UserRequestQueryVariables = {
      userId: user ? user.id : 0,
      page: currentPage,
      search: searchString,
      own: isOwn,
    };

    listRequests({ variables, fetchPolicy: "network-only" });
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
    if (data && data.listRequests) {
      const { users, totalPages } = data.listRequests;
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
        const friendId = !isOwn ? friend.requestUserId : friend.targetUserId;
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

export default RequestList;
