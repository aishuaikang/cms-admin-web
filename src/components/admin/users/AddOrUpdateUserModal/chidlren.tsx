import {
  addUserMutationFn,
  updateUserMutationFn,
  USER_LIST_QUERY_KEY,
} from '@/apis/user';
import { User } from '@/apis/user/types';
import { Route as AdminUserRoute } from '@/routes/admin/users/route';
import {
  Box,
  Button,
  Input,
  LoadingOverlay,
  PasswordInput,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext } from '@tanstack/react-router';
import { useMemoizedFn } from 'ahooks';
import { z } from 'zod';
import UploadImage from '@/components/UploadImage';

export interface AddOrUpdateUserModalChildrenProps {
  onClose: () => void;
  currentUser?: User;
}

const rules = z.object({
  nickname: z
    .string()
    .trim()
    .nonempty('昵称不能为空')
    .min(2, '昵称不能少于2个字符')
    .max(15, '昵称不能超过15个字符'),
  password: z
    .string()
    .trim()
    .nonempty('密码不能为空')
    .min(6, '密码不能少于6个字符')
    .max(20, '密码不能超过20个字符'),
  phone: z
    .string()
    .trim()
    .nonempty('手机号不能为空')
    .min(11, '手机号不能少于11个字符')
    .max(11, '手机号不能超过11个字符')
    .regex(/^[1][3-9][0-9]{9}$/, '手机号格式不正确'),
  username: z
    .string()
    .trim()
    .nonempty('用户名不能为空')
    .min(2, '用户名不能少于2个字符')
    .max(15, '用户名不能超过15个字符'),
  image_id: z.string().nullable(),
});

// type FormValues = z.infer<typeof rules>;

const AddOrUpdateUserModalChildren: React.FC<
  AddOrUpdateUserModalChildrenProps
> = ({ onClose, currentUser }) => {
  const ctx = useRouteContext({ from: AdminUserRoute.to });

  const defaultValues = useMemoizedFn(() => {
    if (!currentUser)
      return {
        nickname: '',
        username: '',
        password: '',
        phone: '',
        image_id: null,
      };
    return {
      nickname: currentUser.nickname,
      username: currentUser.username,
      password: '',
      phone: currentUser.phone,
      image_id: currentUser.image_id,
    };
  });

  const formApi = useForm({
    defaultValues: defaultValues(),
    onSubmit: async ({ value }) => {
      if (currentUser) {
        await updateUserMutation({
          id: currentUser.id,
          ...value,
        });
      } else {
        await addUserMutation({
          ...value,
          is_super: false,
        });
      }
    },
    validators: {
      onChange: rules,
    },
  });

  const { mutateAsync: addUserMutation, isPending: isAddUserPending } =
    useMutation({
      mutationFn: addUserMutationFn,
      onMutate: () => {
        return notifications.show({
          loading: true,
          message: '请稍等片刻，正在添加用户',
          autoClose: false,
          withCloseButton: false,
        });
      },
      onSuccess: (_data, _var, context) => {
        notifications.update({
          id: context,
          color: 'green',
          message: '添加用户成功',
          loading: false,
          autoClose: 2000,
        });

        formApi.reset();

        onClose();

        ctx.queryClient.invalidateQueries({
          queryKey: [USER_LIST_QUERY_KEY],
        });
      },
      onError: (error, _var, context) => {
        notifications.update({
          id: context,
          color: 'red',
          title: '添加用户失败',
          message: error.message,
          loading: false,
          autoClose: 2000,
        });
      },
    });

  const { mutateAsync: updateUserMutation, isPending: isUpdateUserPending } =
    useMutation({
      mutationFn: updateUserMutationFn,
      onMutate: () => {
        return notifications.show({
          loading: true,
          message: '请稍等片刻，正在修改用户',
          autoClose: false,
          withCloseButton: false,
        });
      },
      onSuccess: (_data, _var, context) => {
        notifications.update({
          id: context,
          color: 'green',
          message: '修改用户成功',
          loading: false,
          autoClose: 2000,
        });

        formApi.reset();

        onClose();

        ctx.queryClient.invalidateQueries({
          queryKey: [USER_LIST_QUERY_KEY],
        });
      },
      onError: (error, _var, context) => {
        notifications.update({
          id: context,
          color: 'red',
          title: '修改用户失败',
          message: error.message,
          loading: false,
          autoClose: 2000,
        });
      },
    });

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isAddUserPending || isUpdateUserPending}
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
        onReset={() => formApi.reset()}
      >
        <formApi.Field
          name="image_id"
          children={({ state, handleChange }) => (
            <UploadImage value={state.value} onChange={handleChange} />

            // <TextInput
            //   label="头像"
            //   variant="filled"
            //   name={name}
            //   value={state.value}
            //   onBlur={handleBlur}
            //   onChange={(e) => handleChange(e.target.value)}
            //   error={state.meta.errors[0]?.message}
            //   rightSection={
            //     state.value !== '' ? (
            //       <Input.ClearButton onClick={() => handleChange('')} />
            //     ) : undefined
            //   }
            //   rightSectionPointerEvents="auto"
            //   placeholder="头像ID"
            // />
          )}
        />

        <formApi.Field
          name="nickname"
          children={({ name, state, handleChange, handleBlur }) => {
            return (
              <TextInput
                withAsterisk
                label="昵称"
                variant="filled"
                name={name}
                value={state.value}
                onBlur={handleBlur}
                onChange={(e) => handleChange(e.target.value)}
                error={state.meta.errors[0]?.message}
                rightSection={
                  state.value !== '' ? (
                    <Input.ClearButton onClick={() => handleChange('')} />
                  ) : undefined
                }
                rightSectionPointerEvents="auto"
                placeholder="ask"
              />
            );
          }}
        />
        <formApi.Field
          name="username"
          children={({ name, state, handleChange, handleBlur }) => (
            <TextInput
              withAsterisk
              label="用户名"
              variant="filled"
              name={name}
              value={state.value}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e.target.value)}
              error={state.meta.errors[0]?.message}
              rightSection={
                state.value !== '' ? (
                  <Input.ClearButton onClick={() => handleChange('')} />
                ) : undefined
              }
              rightSectionPointerEvents="auto"
              placeholder="admin"
            />
          )}
        />
        <formApi.Field
          name="password"
          children={({ name, state, handleChange, handleBlur }) => (
            <PasswordInput
              withAsterisk
              label="密码"
              variant="filled"
              name={name}
              value={state.value}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e.target.value)}
              error={state.meta.errors[0]?.message}
              placeholder="123456"
            />
          )}
        />

        <formApi.Field
          name="phone"
          children={({ name, state, handleChange, handleBlur }) => (
            <TextInput
              withAsterisk
              label="手机号"
              variant="filled"
              name={name}
              value={state.value}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e.target.value)}
              error={state.meta.errors[0]?.message}
              rightSection={
                state.value !== '' ? (
                  <Input.ClearButton onClick={() => handleChange('')} />
                ) : undefined
              }
              rightSectionPointerEvents="auto"
              placeholder="13812345678"
            />
          )}
        />

        <Box className="flex flex-row-reverse gap-4">
          <formApi.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <>
                <Button
                  variant="filled"
                  type="submit"
                  loading={isSubmitting}
                  disabled={!canSubmit}
                >
                  提交
                </Button>
                <Button variant="default" type="reset" disabled={isSubmitting}>
                  重置
                </Button>
              </>
            )}
          />
        </Box>
      </form>
    </Box>
  );
};

export default AddOrUpdateUserModalChildren;
