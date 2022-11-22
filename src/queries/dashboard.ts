import { gql } from "@apollo/client";

export const LIST_FRIENDS_POSTS = gql`
  query listFriendsPosts($userId: ID!) {
    listFriendsPosts(userId: $userId) {
      id
      title
      text
      user {
        id
        email
        username
      }
      createdAt
      updatedAt
    }
  }
`;

export const FRIENDS_POSTS_SUBSCRIPTION = gql`
  subscription friendsPostsChanges($userId: ID!) {
    friendsPostsChanges(userId: $userId) {
      post {
        id
        title
        text
        createdAt
        updatedAt
        user {
          id
          email
          username
        }
      }
      action
    }
  }
`;
