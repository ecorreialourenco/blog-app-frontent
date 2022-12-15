import { gql } from "@apollo/client";

export const GET_REQUESTS_COUNT = gql`
  query listRequests($userId: ID!) {
    listRequests(userId: $userId, page: 0, own: false) {
      totalRecords
    }
  }
`;
