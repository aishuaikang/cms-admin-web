import { requestJson } from '@/utils';
import { queryOptions } from '@tanstack/react-query';
import { AddDictParams, Dict, UpdateDictParams } from './types';

export const DICT_LIST_QUERY_KEY = 'getDictList';

// 获取字典列表
export const getDictListQueryOptions = () =>
  queryOptions({
    queryKey: [DICT_LIST_QUERY_KEY],
    queryFn: async () => {
      return await requestJson<Dict[]>(`/admin/dict`);
    },
  });

// 添加字典
export const addDictMutationFn = async (data: AddDictParams) => {
  return await requestJson<null>(`/admin/dict`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 修改新闻
export const updateDictMutationFn = async ({
  id,
  ...data
}: UpdateDictParams) => {
  return await requestJson<null>(`/admin/user/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// 删除字典
export const deleteDictMutationFn = async (id: Dict['id']) => {
  return await requestJson<null>(`/admin/dict/${id}`, {
    method: 'DELETE',
  });
};
