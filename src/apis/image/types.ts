import { Article } from '../article/types';
import { User } from '../user/types';

export interface Image {
  id: string;
  title: string;
  hash: string;
  articles: Article[];
  users: User[];
  createdAt: string;
  updatedAt: string;
}
