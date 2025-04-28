import { useAuth } from '@contexts/auth';
import {
  Box,
  Button,
  LoadingOverlay,
  PasswordInput,
  TextInput,
} from '@mantine/core';
import { IconLock, IconUser } from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
// import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

export interface LoginModalChildrenProps {
  onClose: () => void;
}

const LoginModalChildren: React.FC<LoginModalChildrenProps> = ({ onClose }) => {
  const auth = useAuth();

  const rules = z.object({
    username: z
      .string()
      .nonempty('用户名不能为空')
      .max(20, '用户名不能超过20个字符'),
    password: z
      .string()
      .nonempty('密码不能为空')
      .max(20, '密码不能超过20个字符'),
    // code: z.string().nonempty('验证码不能为空').max(6, '验证码不能超过6个字符'),
  });

  //   const navigate = useNavigate();

  const formApi = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await auth.login({
        ...value,
        password: value.password,
      });

      onClose();
    },
    validators: {
      onChange: rules,
    },
  });

  //   useUpdateEffect(() => {
  //     if (!auth.isAuthenticated) {
  //       return;
  //     }
  //     // 判断是url中是否有redirect参数

  //     const urlParams = new URLSearchParams(window.location.search);
  //     const redirectUrl = urlParams.get('redirect');

  //     if (redirectUrl) navigate({ to: redirectUrl });
  //   }, [auth.isAuthenticated]);

  return (
    <>
      <LoadingOverlay
        visible={auth.isLoginPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await formApi.handleSubmit();
        }}
      >
        <formApi.Field
          name="username"
          children={({ name, state, handleChange, handleBlur }) => {
            return (
              <TextInput
                leftSection={<IconUser size={16} />}
                variant="filled"
                name={name}
                value={state.value}
                onBlur={handleBlur}
                onChange={(e) => handleChange(e.target.value)}
                autoComplete="username"
                error={state.meta.errors[0]?.message}
                placeholder="账号"
                data-autofocus
              />
            );
          }}
        />
        <formApi.Field
          name="password"
          children={({ name, state, handleChange, handleBlur }) => (
            <PasswordInput
              leftSection={<IconLock size={16} />}
              variant="filled"
              type="password"
              name={name}
              value={state.value}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e.target.value)}
              autoComplete="current-password"
              error={state.meta.errors[0]?.message}
              placeholder="密码"
            />
          )}
        />
        <Box className="flex justify-between">
          <formApi.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                variant="filled"
                type="submit"
                fullWidth
                loading={isSubmitting}
                disabled={!canSubmit}
              >
                登录
              </Button>
            )}
          />
        </Box>
      </form>
    </>
  );
};
export default LoginModalChildren;
