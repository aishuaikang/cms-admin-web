import { Article } from '../article/types';
import { Dict } from '../dict/types';
import { User } from '../user/types';

export interface Image {
  id: string;
  title: string;
  hash: string;
  articles: Article[];
  users: User[];
  dicts: Dict[];
  createdAt: string;
  updatedAt: string;
}
