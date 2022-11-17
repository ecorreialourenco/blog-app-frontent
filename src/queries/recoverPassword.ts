import { gql } from "@apollo/client";

export const RECOVER_PASSWORD = gql`
  mutation recoverPassword($email: String) {
    recoverPassword(email: $email) {
      token
      secret
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $id: ID
    $secretPassword: String
    $oldPassword: String
    $newPassword: String!
    $recoverToken: String
  ) {
    changePassword(
      id: $id
      secretPassword: $secretPassword
      oldPassword: $oldPassword
      newPassword: $newPassword
      recoverToken: $recoverToken
    )
  }
`;
