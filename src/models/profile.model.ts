import { Status } from "../enum/status.enum";

export interface User {
  id: number;
  username?: string;
  email: string;
  image?: string;
  friend?: Friend;
  friends?: Friend[];
}

export interface Friend {
  id: number;
  requestUserId: number;
  targetUserId: number;
  status: Status;
  block?:boolean
}
