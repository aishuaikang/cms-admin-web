import { requestJson } from '@/utils';
import { Image } from './type';

export const USER_LIST_QUERY_KEY = 'getUserList';

// // 获取用户列表
// export const getUserListQueryOptions = (data?: GetUserListParams) =>
//   queryOptions({
//     queryKey: [USER_LIST_QUERY_KEY, data],
//     queryFn: async () => {
//       const query = qs.stringify(data, { addQueryPrefix: true });
//       return await requestJson<User[]>(`/admin/user${query}`);
//     },
//   });

// 添加图片
export const addImageMutationFn = async (data: FormData) => {
  return await requestJson<Image[]>(`/admin/image`, {
    method: 'POST',
    body: data,
    isFormData: true,
  });
};

// // 修改新闻
// export const updateUserMutationFn = async ({
//   id,
//   ...data
// }: UpdateUserParams) => {
//   return await requestJson<null>(`/admin/user/${id}`, {
//     method: 'PUT',
//     body: JSON.stringify(data),
//   });
// };

// // 删除用户
// export const deleteUserMutationFn = async (id: User['id']) => {
//   return await requestJson<null>(`/admin/user/${id}`, {
//     method: 'DELETE',
//   });
// };
