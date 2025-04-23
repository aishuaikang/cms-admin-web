import * as React from 'react';
import { useContext } from 'react';
import { LoginParams, LoginResponse } from '@/apis/types';
import { loginMutationFn, logoutMutationFn } from '@apis/index';
import { notifications } from '@mantine/notifications';
import { setUserinfoStore, userinfoStore } from '@store/userinfoStore';
import { useMutation } from '@tanstack/react-query';
import { useStore } from '@tanstack/react-store';
import { useCreation, useMemoizedFn } from 'ahooks';

export interface AuthContext {
  isAuthenticated: boolean;
  login: (loginParams: LoginParams) => Promise<LoginResponse>;
  isLoginPending: boolean;
  logout: () => Promise<null>;
  isLogoutPending: boolean;
  userinfo: LoginResponse | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const userinfo = useStore(userinfoStore);

  const isAuthenticated = useCreation(() => !!userinfo?.token, [userinfo]);

  const { mutateAsync: loginMutation, isPending: isLoginPending } = useMutation(
    {
      mutationFn: loginMutationFn,
      onSuccess: (data) => {
        setUserinfoStore(data);

        notifications.show({
          color: 'green',
          message: '登录成功',
        });
      },
      onError: (error) => {
        notifications.show({
          color: 'red',
          title: '登录失败',
          message: error.message,
        });
      },
    }
  );

  const { mutateAsync: logoutMutation, isPending: isLogoutPending } =
    useMutation({
      mutationFn: logoutMutationFn,
      onSuccess: () => {
        setUserinfoStore(null);

        notifications.show({
          color: 'green',
          message: '退出登录成功',
        });
      },
      onError: (error) => {
        notifications.show({
          color: 'red',
          title: '退出登录失败',
          message: error.message,
        });
      },
    });

  const logout = useMemoizedFn(async () => logoutMutation());

  const login = useMemoizedFn(async (loginParams: LoginParams) =>
    loginMutation(loginParams)
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userinfo,
        login,
        isLoginPending,
        logout,
        isLogoutPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth必须在AuthProvider内部使用');
  return context;
}
