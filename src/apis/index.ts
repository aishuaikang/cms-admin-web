import { queryOptions } from '@tanstack/react-query';
import { requestJson } from '@utils/index';
import { LoginParams, LoginResponse } from './types';

export const testQueryOptions = () =>
  queryOptions({
    queryKey: ['test'],
    queryFn: () => {
      return new Promise<string>((resolve) =>
        setTimeout(() => {
          //   reject(new Error('这里是服务器的错误信息'));
          resolve("I'm slow data");
        }, 3000)
      );
    },
  });

export const loginMutationFn = async (data: LoginParams) => {
  return await requestJson<LoginResponse>('/common/account/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const logoutMutationFn = async () => {
  return await requestJson<null>('/admin/account/logout', {
    method: 'POST',
  });
};
