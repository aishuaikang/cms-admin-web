import { CommonPage } from '@apis/types';
import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';
import { requestJson } from '@utils/index';
import { Message } from './types';

export const MESSAGE_LIST_QUERY_KEY = 'getMessageList';

// 获取消息列表
export const getMessageListQueryOptions = (pageNum: number, pageSize: number) =>
  queryOptions({
    queryKey: [MESSAGE_LIST_QUERY_KEY, pageNum, pageSize],
    queryFn: async () => {
      const query = qs.stringify(
        { pageNum, pageSize },
        { addQueryPrefix: true }
      );
      return await requestJson<CommonPage<Message>>(
        `/baseinfo/messages${query}`
      );
    },
  });

// 批量删除消息
export const deleteMessageListMutationFn = async (ids: string[]) => {
  return await requestJson<CommonPage<Message>>(`/baseinfo/messages`, {
    method: 'DELETE',
    body: JSON.stringify({
      ids,
    }),
  });
};

// 批量已读消息
export const readMessageListMutationFn = async (ids: string[]) => {
  return await requestJson<CommonPage<Message>>(`/baseinfo/messages`, {
    method: 'PUT',
    body: JSON.stringify({
      ids,
    }),
  });
};
