import { requestJson } from '@/utils';
import { queryOptions } from '@tanstack/react-query';
import { AddTagParams, Tag, UpdateTagParams } from './types';

export const TAG_LIST_QUERY_KEY = 'getTagList';

// 获取标签列表
export const getTagListQueryOptions = () =>
  queryOptions({
    queryKey: [TAG_LIST_QUERY_KEY],
    queryFn: async () => {
      return await requestJson<Tag[]>(`/admin/tag`);
    },
  });

// 添加标签
export const addTagMutationFn = async (data: AddTagParams) => {
  return await requestJson<null>(`/admin/tag`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 修改标签
export const updateTagMutationFn = async ({
  id,
  ...data
}: UpdateTagParams): Promise<null> => {
  return await requestJson<null>(`/admin/tag/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// 删除标签
export const deleteTagMutationFn = async (id: Tag['id']) => {
  return await requestJson<null>(`/admin/tag/${id}`, {
    method: 'DELETE',
  });
};
