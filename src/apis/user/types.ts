export interface User {
  id: string;
  nickname: string;
  phone: string;
  username: string;
  isSuper: boolean;
  imageId: string | null;
  articles: null;
  createdAt: string;
  updatedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetUserListParams {
  // TODO: Add more fields as needed
}

export type AddUserParams = Pick<
  User,
  'nickname' | 'phone' | 'username' | 'isSuper' | 'imageId'
> & {
  password: string;
};

export type UpdateUserParams = Partial<
  Pick<User, 'nickname' | 'phone' | 'username' | 'isSuper' | 'imageId'> & {
    id: string;
  }
>;
