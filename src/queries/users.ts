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
  query listUsers($excludeId: ID!) {
    listUsers(excludeId: $excludeId) {
      id
      username
      email
      image
      friend(id: $excludeId) {
        id
        requestUserId
        targetUserId
        status
      }
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
