import { gql } from "@apollo/client";

export const LIST_POST = gql`
  query listPosts($userId: ID!) {
    listPosts(userId: $userId) {
      id
      title
      text
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_POST_SUBSCRIPTION = gql`
  subscription postCreated($userId: ID!) {
    postCreated(userId: $userId) {
      id
      title
      text
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_POST_SUBSCRIPTION = gql`
  subscription postUpdate($userId: ID!) {
    postUpdate(userId: $userId) {
      id
      title
      text
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_POST_SUBSCRIPTION = gql`
  subscription postDeleted($userId: ID!) {
    postDeleted(userId: $userId) {
      id
      userId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_POST = gql`
  mutation createPost($title: String, $text: String, $userId: ID) {
    createPost(title: $title, text: $text, userId: $userId) {
      id
      title
      text
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_POST = gql`
  mutation updatePost($id: ID!, $title: String, $text: String) {
    updatePost(title: $title, text: $text, id: $id) {
      id
      title
      text
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_POST = gql`
  mutation updatePost($id: ID!) {
    deletePost(id: $id) {
      id
      userId
    }
  }
`;
