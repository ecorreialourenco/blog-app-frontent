import { Status } from "../enum/status.enum";

interface PaginatedVariables {
  page: number;
  search: string;
}

export interface UserQueryVariables extends PaginatedVariables {
  excludeId: number;
  statusIn?: Status[];
  statusNotIn?: Status[];
  blocked?: boolean;
}

export interface UserRequestQueryVariables extends PaginatedVariables {
  userId: number;
  own: boolean;
}
