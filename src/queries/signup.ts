import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation signup(
    $email: String
    $password: String
    $secret: String
    $secretPassword: String
  ) {
    signup(
      email: $email
      password: $password
      secret: $secret
      secretPassword: $secretPassword
    ) {
      id
      username
      email
      image
      friends {
        id
        requestUserId
        targetUserId
        status
      }
    }
  }
`;
