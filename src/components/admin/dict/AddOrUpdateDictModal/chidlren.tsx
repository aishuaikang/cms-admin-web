import {
  addDictMutationFn,
  DICT_LIST_QUERY_KEY,
  updateDictMutationFn,
} from '@/apis/dict';
import { Dict } from '@/apis/dict/types';
import { Route as AdminDictConfigRoute } from '@/routes/admin/dict_config/route';
// import { Menu } from '@/apis/menus/types';
// import { Route as SystemAdminMenusRoute } from '@/routes/system_admin/menus/route';
// import { addMenuMutationFn, MENU_LIST_QUERY_KEY, updateMenuMutationFn } from '@apis/menus';
import {
  Box,
  Button,
  Input,
  LoadingOverlay,
  Textarea,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext } from '@tanstack/react-router';
import { useMemoizedFn } from 'ahooks';
import { z } from 'zod';

export interface AddOrUpdateDictModalChildrenProps {
  onClose: () => void;
  currentDict?: Dict;
  isEdit: boolean;
}

const AddOrUpdateDictModalChildren: React.FC<
  AddOrUpdateDictModalChildrenProps
> = ({ onClose, currentDict, isEdit }) => {
  const ctx = useRouteContext({ from: AdminDictConfigRoute.to });

  const rules = z.object({
    name: z
      .string()
      .trim()
      .nonempty('字典名称不能为空')
      .min(2, '字典名称不能少于2个字符')
      .max(15, '字典名称不能超过15个字符')
      .regex(
        /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/,
        '字典名称只能包含字母、数字、中文和下划线'
      ),
    code: z
      .string()
      .trim()
      .nonempty('字典名称不能为空')
      .min(2, '字典名称不能少于2个字符')
      .max(50, '字典名称不能超过50个字符')
      .regex(/^[a-zA-Z0-9_]+$/, '字典名称只能包含字母、数字和下划线'),
    extra: z.string().trim().max(1024, '扩展内容不能超过1024个字符'),
    description: z.string().trim().max(256, '描述不能超过256个字符'),
  });

  const defaultValues = useMemoizedFn(() => {
    if (isEdit) {
      if (!currentDict) throw new Error('当前字典不存在');
      return {
        name: currentDict.name,
        code: currentDict.code,
        extra: currentDict.extra,
        description: currentDict.description,
      };
    }

    return {
      name: '',
      code: '',
      extra: '',
      description: '',
    };
  });

  const formApi = useForm({
    defaultValues: defaultValues(),
    onSubmit: async ({ value }) => {
      if (isEdit) {
        if (!currentDict) throw new Error('当前字典不存在');
        await updateDictMutation({
          id: currentDict.id,
          ...value,
        });
      } else {
        await addDictMutation({
          ...value,
          parent_id: currentDict?.id ?? null,
        });
      }
    },
    validators: {
      onChange: rules,
    },
  });

  const { mutateAsync: addDictMutation, isPending: isAddDictPending } =
    useMutation({
      mutationFn: addDictMutationFn,
      onMutate: () => {
        return notifications.show({
          loading: true,
          message: '请稍等片刻，正在添加字典',
          autoClose: false,
          withCloseButton: false,
        });
      },
      onSuccess: (_data, _var, context) => {
        notifications.update({
          id: context,
          color: 'green',
          message: '添加字典成功',
          loading: false,
          autoClose: 2000,
        });

        formApi.reset();

        onClose();

        ctx.queryClient.invalidateQueries({
          queryKey: [DICT_LIST_QUERY_KEY],
        });
      },
      onError: (error, _var, context) => {
        notifications.update({
          id: context,
          color: 'red',
          title: '添加字典失败',
          message: error.message,
          loading: false,
          autoClose: 2000,
        });
      },
    });

  const { mutateAsync: updateDictMutation, isPending: isUpdateDictPending } =
    useMutation({
      mutationFn: updateDictMutationFn,
      onMutate: () => {
        return notifications.show({
          loading: true,
          message: '请稍等片刻，正在修改字典',
          autoClose: false,
          withCloseButton: false,
        });
      },
      onSuccess: (_data, _var, context) => {
        notifications.update({
          id: context,
          color: 'green',
          message: '修改字典成功',
          loading: false,
          autoClose: 2000,
        });

        formApi.reset();

        onClose();

        ctx.queryClient.invalidateQueries({
          queryKey: [DICT_LIST_QUERY_KEY],
        });
      },
      onError: (error, _var, context) => {
        notifications.update({
          id: context,
          color: 'red',
          title: '修改字典失败',
          message: error.message,
          loading: false,
          autoClose: 2000,
        });
      },
    });

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isAddDictPending || isUpdateDictPending}
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
          name="name"
          children={({ name, state, handleChange, handleBlur }) => {
            return (
              <TextInput
                withAsterisk
                label="名称"
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
                placeholder="公司简介"
                description="字典名称只能包含字母、数字、中文和下划线"
              />
            );
          }}
        />
        <formApi.Field
          name="code"
          children={({ name, state, handleChange, handleBlur }) => {
            return (
              <TextInput
                withAsterisk
                label="Code"
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
                placeholder="CompanyProfile"
                description="字典名称只能包含字母、数字和下划线"
              />
            );
          }}
        />
        <formApi.Field
          name="extra"
          children={({ name, state, handleChange, handleBlur }) => (
            <Textarea
              label="Extra"
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
              placeholder="描述"
              autosize
              minRows={2}
              maxRows={4}
              description="Extra不能超过1024个字符"
              maxLength={1024}
            />
          )}
        />
        <formApi.Field
          name="description"
          children={({ name, state, handleChange, handleBlur }) => (
            <Textarea
              label="描述"
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
              placeholder="描述"
              autosize
              minRows={2}
              maxRows={4}
              description="描述不能超过256个字符"
              maxLength={256}
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

export default AddOrUpdateDictModalChildren;
