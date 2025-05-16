import { CommonResponse } from '@/apis/types';
import { router } from '@/main';
import { Route as IndexRoute } from '@/routes/admin/route';
import { nprogress } from '@mantine/nprogress';
import { setIsShowLoginModalStore } from '@store/isShowLoginModalStore';
import { setUserinfoStore, userinfoStore } from '@store/userinfoStore';
import { sha512 } from 'js-sha512';

async function requestJson<T>(
  url: string,
  init?: RequestInit & {
    isFormData?: boolean;
  }
): Promise<CommonResponse<T>['data']> {
  nprogress.reset();
  nprogress.start();

  const headers = {
    ...init?.headers,
  };

  if (!init?.isFormData) {
    Reflect.set(headers, 'Content-Type', 'application/json');
  }

  const token = userinfoStore.state?.token;
  if (token) Reflect.set(headers, 'Authorization', `Bearer ${token}`);

  const response = await fetch(
    `${import.meta.env.VITE_BASE_PATH}${import.meta.env.VITE_BASE_API}${url}`,
    {
      ...init,
      headers: new Headers(headers),
    }
  );

  if (!response.ok) {
    nprogress.complete();
    throw new Error(`HTTP错误！状态码: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const json = (await response.json()) as CommonResponse<T>;

    if (json.code !== 200) {
      if (json.code === 401) {
        router.navigate({
          to: IndexRoute.to,
          replace: true,
        });
        setUserinfoStore(null);
        setIsShowLoginModalStore(true);
      }
      nprogress.complete();
      throw new Error(json.error || '请求失败');
    }
    nprogress.complete();
    return json.data;
  } else {
    nprogress.complete();
    throw new Error('响应的不是JSON');
  }
}

function _toHash(str: string) {
  const arraySize = 11113;
  let hashCode = 0;
  for (let i = 0; i < str.length; i++) {
    const letterValue = str.charCodeAt(i) - 96;
    const newLocal = hashCode << 5;
    hashCode = (newLocal + letterValue) % arraySize;
  }
  return hashCode;
}

export const encryptLogin = (
  username: string,
  password: string,
  token: string
) => {
  /*
      前端：获取用户名name*，密码pass*，以及服务器传来的随机串R
          P1* = sha(name*)
          P2* = sha(sha(pass) + P1*)
          K* = P1* % 256 + sha(R) % 256 + 512 （511<K*<1024）
          计算 PK** = sha(PK*-1*+P1*)
          计算 PR*=sha(PK**+R)
          将R，name*与PR*发送到后端
      */
  const p1 = sha512(username);
  const k = (_toHash(p1) % 256) + (_toHash(sha512(token)) % 256) + 512;
  let pk = sha512(sha512(password) + p1);
  for (let i = 0; i < k - 2; i++) {
    pk = sha512(pk + p1);
  }

  return sha512(pk + token);
};

export { requestJson, type CommonResponse };

export const getEnumOptions = <T extends object>(Enum: T) => {
  return Object.keys(Enum)
    .filter((item) => isNaN(parseInt(item, 10)))
    .map((item) => ({
      label: item,
      value: Enum[item as keyof T],
    }));
};
