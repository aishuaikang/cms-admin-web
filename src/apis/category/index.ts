import { requestJson } from '@/utils';
import { queryOptions } from '@tanstack/react-query';
import { AddCategoryParams, Category, UpdateCategoryParams } from './types';

export const CATEGORY_LIST_QUERY_KEY = 'getCategoryList';

// 获取分类列表
export const getCategoryListQueryOptions = () =>
  queryOptions({
    queryKey: [CATEGORY_LIST_QUERY_KEY],
    queryFn: async () => {
      return await requestJson<Category[]>(`/admin/category`);
    },
  });

// 添加分类
export const addCategoryMutationFn = async (data: AddCategoryParams) => {
  return await requestJson<null>(`/admin/category`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 修改分类
export const updateCategoryMutationFn = async ({
  id,
  ...data
}: UpdateCategoryParams): Promise<null> => {
  return await requestJson<null>(`/admin/category/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// 删除分类
export const deleteCategoryMutationFn = async (id: Category['id']) => {
  return await requestJson<null>(`/admin/category/${id}`, {
    method: 'DELETE',
  });
};
