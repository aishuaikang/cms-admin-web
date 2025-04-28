import { requestJson } from '@/utils';
import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';
import { CommonPage } from '../types';
import {
  AddArticleParams,
  Article,
  GetArticleListParams,
  UpdateArticleParams,
} from './types';

export const ARTICLE_LIST_QUERY_KEY = 'getArticleList';

// 获取新闻列表
export const getArticleListQueryOptions = (params: GetArticleListParams) =>
  queryOptions({
    queryKey: [ARTICLE_LIST_QUERY_KEY, params],
    queryFn: async () => {
      const query = qs.stringify(params, { addQueryPrefix: true });
      return await requestJson<CommonPage<Article>>(`/admin/article${query}`);
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
