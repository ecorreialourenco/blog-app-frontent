import { FC, useEffect, useState } from "react";
import { useLazyQuery, useSubscription } from "@apollo/client";
import {
  LIST_BLOCKED_USERS,
  UPDATE_FRIEND_SUBSCRIPTION,
} from "../../../../queries/users";
import { User } from "../../../../models/profile.model";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import List from "../common/List";
import { UserQueryVariables } from "../../../../models/user.model";
import { CircularProgress } from "@mui/material";
import "./BlockedList.scss";

const BlockedList: FC = () => {
  const [list, setList] = useState<User[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const [listBlockedUsers, { loading, data }] =
    useLazyQuery(LIST_BLOCKED_USERS);

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
    };

    listBlockedUsers({ variables, fetchPolicy: "network-only" });
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
    if (data && data.listBlockedUsers) {
      const { users, totalPages } = data.listBlockedUsers;
      setList(users);
      total !== totalPages && setTotal(totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (dataFriendChanged && dataFriendChanged.friendsChange && !!user) {
      const { friend } = dataFriendChanged.friendsChange;
      const { requestUserId, targetUserId } = friend;
      const friendId =
        parseInt(requestUserId) !== user.id ? requestUserId : targetUserId;

      const listToUpdate = list.filter((item) => {
        return item.id !== friendId;
      });

      setList(listToUpdate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFriendChanged]);

  return loading ? (
    <CircularProgress />
  ) : (
    <List
      list={list}
      total={total}
      currentPage={page}
      handleChangePage={handleChangePage}
      handleChangeSearch={handleChangeSearch}
    />
  );
};

export default BlockedList;
