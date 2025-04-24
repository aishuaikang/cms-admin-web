import { requestJson } from '@/utils';
import { queryOptions } from '@tanstack/react-query';
import { Image } from './type';

export const IMAGE_LIST_QUERY_KEY = 'getImageList';

// 获取图片列表
export const getImageListQueryOptions = () =>
  queryOptions({
    queryKey: [IMAGE_LIST_QUERY_KEY],
    queryFn: async () => {
      return await requestJson<Image[]>(`/admin/image`);
    },
  });

// 添加图片
export const addImageMutationFn = async (data: FormData) => {
  return await requestJson<Image[]>(`/admin/image`, {
    method: 'POST',
    body: data,
    isFormData: true,
  });
};

// 删除图片
export const deleteImageMutationFn = async (id: Image['id']) => {
  return await requestJson<null>(`/admin/image/${id}`, {
    method: 'DELETE',
  });
};
