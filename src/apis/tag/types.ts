import { Article } from '../article/types';

export interface Tag {
  id: string;
  name: string;
  description: string;
  articles: Article[];
  created_at: string;
  updated_at: string;
}

export type AddTagParams = Pick<Tag, 'name' | 'description'>;

export type UpdateTagParams = Partial<AddTagParams> & {
  id: Tag['id'];
};
