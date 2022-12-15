import { gql } from "@apollo/client";

export const LIST_FRIENDS_POSTS = gql`
  query listFriendsPosts($userId: ID!, $page: Int) {
    listFriendsPosts(userId: $userId, page: $page) {
      posts {
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
      totalPages
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
