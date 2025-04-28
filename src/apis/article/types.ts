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
  categoryId: string;
  images: Image[];
  tags: Tag[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetArticleListParams {
  page: number;
  pageSize: number;
  title?: string;
  status?: ArticleStatus;
  categoryId?: string;
}

export type AddArticleParams = Omit<
  Article,
  'id' | 'createdAt' | 'updatedAt' | 'userId' | 'tags' | 'images'
> & {
  imageIds: string[] | null;
  tagIds: string[] | null;
};

export type UpdateArticleParams = Partial<
  Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'tags'>
> & {
  imageIds: string[] | null;
  tagIds: string[] | null;
} & {
  id: Article['id'];
};
