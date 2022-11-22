import { User } from "./profile.model";

export interface PostModel {
  id: number;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}
