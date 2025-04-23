import { requestJson } from '@/utils';
import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';
import {
  AddUserParams,
  GetUserListParams,
  UpdateUserParams,
  User,
} from './types';

export const USER_LIST_QUERY_KEY = 'getUserList';

// 获取用户列表
export const getUserListQueryOptions = (data?: GetUserListParams) =>
  queryOptions({
    queryKey: [USER_LIST_QUERY_KEY, data],
    queryFn: async () => {
      const query = qs.stringify(data, { addQueryPrefix: true });
      return await requestJson<User[]>(`/admin/user${query}`);
    },
  });

// 添加用户
export const addUserMutationFn = async (data: AddUserParams) => {
  return await requestJson<null>(`/admin/user`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 修改新闻
export const updateUserMutationFn = async ({
  id,
  ...data
}: UpdateUserParams) => {
  return await requestJson<null>(`/admin/user/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// 删除用户
export const deleteUserMutationFn = async (id: User['id']) => {
  return await requestJson<null>(`/admin/user/${id}`, {
    method: 'DELETE',
  });
};
