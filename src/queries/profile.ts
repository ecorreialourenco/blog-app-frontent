import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $id: ID!
    $username: String
    $email: String
    $image: String
  ) {
    updateProfile(id: $id, username: $username, email: $email, image: $image) {
      id
      email
      password
      secret
      secretPassword
      username
      image
    }
  }
`;
