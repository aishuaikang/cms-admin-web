import { requestJson } from '@/utils';
import { CommonPage } from '@apis/types';
import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';
import {
  AddArticleParams,
  Article,
  GetArticleListParams,
  UpdateArticleParams,
} from './types';

export const ARTICLE_LIST_QUERY_KEY = 'getArticleList';

// 获取新闻列表
export const getArticleListQueryOptions = (data?: GetArticleListParams) =>
  queryOptions({
    queryKey: [ARTICLE_LIST_QUERY_KEY, data],
    queryFn: async () => {
      const query = qs.stringify(data, { addQueryPrefix: true });
      return await requestJson<CommonPage<Article>>(`/baseinfo/news${query}`);
    },
  });

// 添加新闻
export const addArticleMutationFn = async (data: AddArticleParams) => {
  return await requestJson<null>(`/baseinfo/news`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 修改新闻
export const updateArticleMutationFn = async ({
  articleId,
  data,
}: UpdateArticleParams): Promise<null> => {
  return await requestJson<null>(`/baseinfo/news/${articleId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// 删除角色
export const deleteArticleMutationFn = async (articleId: Article['id']) => {
  return await requestJson<null>(`/baseinfo/news/${articleId}`, {
    method: 'DELETE',
  });
};
