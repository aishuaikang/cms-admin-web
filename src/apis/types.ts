import { User } from './user/types';

export interface CommonResponse<T> {
  code: number;
  data: T;
  message: string;
  error: string;
}

export interface CommonPage<T> {
  rows: T[];
  total: number;
  pages: number;
}

// 用户登录
export interface LoginParams {
  password: string;
  username: string;
}

export enum FirstLoginEnum {
  '是',
  '否',
}

export type LoginResponse = User & {
  token: string;
};

// export interface LoginResponse {
//   id: string;
//   nickname: string;
//   phone: string;
//   username: string;
//   is_super: boolean;
//   image_id: string | null;
//   articles: null;
//   created_at: string;
//   updated_at: string;
//   token: string;
// }
