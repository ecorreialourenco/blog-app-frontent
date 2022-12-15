import { gql } from "@apollo/client";

export const STATUS_ENUM = gql`
  {
    __type(name: "Status") {
      enumValues {
        name
      }
    }
  }
`;

export const LIST_USERS = gql`
  query listUsers($excludeId: ID!, $page: Int!, $search: String) {
    listUsers(excludeId: $excludeId, page: $page, search: $search) {
      users {
        id
        username
        email
        image
        friend(id: $excludeId) {
          id
          requestUserId
          targetUserId
          status
          block
        }
      }
      totalPages
    }
  }
`;

export const LIST_FRIENDS = gql`
  query listFriends(
    $excludeId: ID!
    $page: Int!
    $statusIn: [Status]
    $statusNotIn: [Status]
    $search: String
  ) {
    listFriends(
      filters: {
        excludeId: $excludeId
        page: $page
        statusIn: $statusIn
        statusNotIn: $statusNotIn
        search: $search
      }
    ) {
      users {
        id
        username
        email
        image
        friend(id: $excludeId) {
          id
          requestUserId
          targetUserId
          status
          block
        }
      }
      totalPages
    }
  }
`;

export const LIST_REQUESTS = gql`
  query listRequests(
    $userId: ID!
    $page: Int!
    $search: String
    $own: Boolean
  ) {
    listRequests(userId: $userId, page: $page, search: $search, own: $own) {
      users {
        id
        username
        email
        image
        friend(id: $userId) {
          id
          requestUserId
          targetUserId
          status
          block
        }
      }
      totalPages
    }
  }
`;

export const LIST_BLOCKED_USERS = gql`
  query listBlockedUsers($excludeId: ID!, $page: Int!, $search: String) {
    listBlockedUsers(excludeId: $excludeId, page: $page, search: $search) {
      users {
        id
        username
        email
        image
        friend(id: $excludeId) {
          id
          requestUserId
          targetUserId
          status
          block
        }
      }
      totalPages
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation addFriend($requestId: ID!, $targetId: ID!) {
    addFriend(requestId: $requestId, targetId: $targetId)
  }
`;

export const UPDATE_FRIEND = gql`
  mutation updateFriend($id: ID!, $status: Status!) {
    updateFriend(id: $id, status: $status) {
      id
    }
  }
`;

export const CREATE_USER_SUBSCRIPTION = gql`
  subscription userCreated {
    userCreated {
      user {
        id
        email
        username
        image
      }
      totalPages
    }
  }
`;

export const UPDATE_USER_SUBSCRIPTION = gql`
  subscription userUpdated {
    userUpdated {
      user {
        id
        email
        username
        image
      }
      totalPages
    }
  }
`;

export const UPDATE_FRIEND_SUBSCRIPTION = gql`
  subscription friendsChange($userId: ID!) {
    friendsChange(userId: $userId) {
      friend {
        id
        requestUserId
        targetUserId
        status
      }
      action
    }
  }
`;
