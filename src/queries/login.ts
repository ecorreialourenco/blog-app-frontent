import { gql } from "@apollo/client";

export const GET_LOGIN = gql`
  query login($email: String, $password: String) {
    login(email: $email, password: $password)
  }
`;
