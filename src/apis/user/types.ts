export interface User {
  id: string;
  nickname: string;
  phone: string;
  username: string;
  is_super: boolean;
  image_id: string | null;
  articles: null;
  created_at: string;
  updated_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetUserListParams {
  // TODO: Add more fields as needed
}

export type AddUserParams = Pick<
  User,
  'nickname' | 'phone' | 'username' | 'is_super' | 'image_id'
> & {
  password: string;
};

export type UpdateUserParams = Partial<
  Pick<User, 'nickname' | 'phone' | 'username' | 'is_super' | 'image_id'> & {
    id: string;
  }
>;
