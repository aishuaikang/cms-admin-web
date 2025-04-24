import { requestJson } from '@/utils';
import { queryOptions } from '@tanstack/react-query';
import { AddArticleParams, Article, UpdateArticleParams } from './types';

export const ARTICLE_LIST_QUERY_KEY = 'getArticleList';

// 获取新闻列表
export const getArticleListQueryOptions = () =>
  queryOptions({
    queryKey: [ARTICLE_LIST_QUERY_KEY],
    queryFn: async () => {
      //   const query = qs.stringify(data, { addQueryPrefix: true });
      return await requestJson<Article[]>(`/admin/article`);
    },
  });

// 添加新闻
export const addArticleMutationFn = async (data: AddArticleParams) => {
  return await requestJson<null>(`/admin/article`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 修改新闻
export const updateArticleMutationFn = async ({
  id,
  ...data
}: UpdateArticleParams): Promise<null> => {
  return await requestJson<null>(`/admin/article/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// 删除新闻
export const deleteArticleMutationFn = async (articleId: Article['id']) => {
  return await requestJson<null>(`/admin/article/${articleId}`, {
    method: 'DELETE',
  });
};
