export enum ArticleStatus {
  草稿,
  已发布,
}

// type ArticleStatus string

// const (
// 	StatusDraft     ArticleStatus = "draft"
// 	StatusPublished ArticleStatus = "published"
// )

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  status: ArticleStatus;
  category_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type AddArticleParams = Omit<
  Article,
  'id' | 'created_at' | 'updated_at' | 'user_id'
> & {
  image_ids?: string[];
  tag_ids?: string[];
};

export type UpdateArticleParams = Partial<AddArticleParams> & {
  id: Article['id'];
};
