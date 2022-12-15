import { FC, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { LIST_BLOCKED_USERS } from "../../../../queries/users";
import { Friend, User } from "../../../../models/profile.model";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { setToken } from "../../../../helpers/setToken";
import List from "../common/List";
import { Status } from "../../../../enum/status.enum";
import { UserQueryVariables } from "../../../../models/queries.model";
import "./BlockedList.scss";

/* TODO: In progress */

const BlockedList: FC = () => {
  const [list, setList] = useState<User[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const dispatch = useDispatch();

  const [listBlockedUsers, { data }] = useLazyQuery(LIST_BLOCKED_USERS);

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

export default BlockedList;
