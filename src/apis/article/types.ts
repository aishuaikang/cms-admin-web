import { Image } from '@/apis/image/types';
import { Tag } from '../tag/types';

export enum ArticleStatus {
  草稿,
  公开,
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  status: ArticleStatus;
  category_id: string;
  images: Image[];
  tags: Tag[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type AddArticleParams = Omit<
  Article,
  'id' | 'created_at' | 'updated_at' | 'user_id' | 'tags' | 'images'
> & {
  image_ids: string[] | null;
  tag_ids: string[] | null;
};

export type UpdateArticleParams = Partial<
  Omit<Article, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'tags'>
> & {
  image_ids: string[] | null;
  tag_ids: string[] | null;
} & {
  id: Article['id'];
};
