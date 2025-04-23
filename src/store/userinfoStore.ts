import { LoginResponse } from '@/apis/types';
import { Store } from '@tanstack/store';

const AUTH_KEY = 'cms.auth.user';

export const userinfoStore = new Store<LoginResponse | null>(
  (() => {
    const userinfoJson = localStorage.getItem(AUTH_KEY);
    if (!userinfoJson) return null;
    return JSON.parse(userinfoJson) as LoginResponse;
  })()
);

export function setUserinfoStore(userinfo: LoginResponse | null) {
  userinfoStore.setState(() => userinfo);
  if (userinfo) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(userinfo));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}
