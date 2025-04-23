import {
  addCategoryMutationFn,
  CATEGORY_LIST_QUERY_KEY,
  updateCategoryMutationFn,
} from '@/apis/category';
import { Category } from '@/apis/category/types';
import { Route as AdminCategoryRoute } from '@/routes/admin/category/route';
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

export interface AddOrUpdateCategoryModalChildrenProps {
  onClose: () => void;
  currentCategory?: Category;
}

const rules = z.object({
  name: z
    .string()
    .trim()
    .nonempty('名称不能为空')
    .min(2, '名称不能少于2个字符')
    .max(15, '名称不能超过15个字符'),
  description: z.string().trim().max(512, '接口权限不能超过512个字符'),
});

const AddOrUpdateCategoryModalChildren: React.FC<
  AddOrUpdateCategoryModalChildrenProps
> = ({ onClose, currentCategory }) => {
  const ctx = useRouteContext({ from: AdminCategoryRoute.to });

  const defaultValues = useMemoizedFn(() => {
    if (!currentCategory)
      return {
        name: '',
        description: '',
      };
    return {
      name: currentCategory.name,
      description: currentCategory.description,
    };
  });

  const formApi = useForm({
    defaultValues: defaultValues(),
    onSubmit: async ({ value }) => {
      if (currentCategory) {
        await updateCategoryMutation({
          id: currentCategory.id,
          ...value,
        });
      } else {
        await addCategoryMutation(value);
      }
    },
    validators: {
      onChange: rules,
    },
  });

  const { mutateAsync: addCategoryMutation, isPending: isAddCategoryPending } =
    useMutation({
      mutationFn: addCategoryMutationFn,
      onMutate: () => {
        return notifications.show({
          loading: true,
          message: '请稍等片刻，正在添加文章',
          autoClose: false,
          withCloseButton: false,
        });
      },
      onSuccess: (_data, _var, context) => {
        notifications.update({
          id: context,
          color: 'green',
          message: '添加文章成功',
          loading: false,
          autoClose: 2000,
        });

        formApi.reset();

        onClose();

        ctx.queryClient.invalidateQueries({
          queryKey: [CATEGORY_LIST_QUERY_KEY],
        });
      },
      onError: (error, _var, context) => {
        notifications.update({
          id: context,
          color: 'red',
          title: '添加文章失败',
          message: error.message,
          loading: false,
          autoClose: 2000,
        });
      },
    });

  const {
    mutateAsync: updateCategoryMutation,
    isPending: isUpdateCategoryPending,
  } = useMutation({
    mutationFn: updateCategoryMutationFn,
    onMutate: () => {
      return notifications.show({
        loading: true,
        message: '请稍等片刻，正在修改文章',
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: (_data, _var, context) => {
      notifications.update({
        id: context,
        color: 'green',
        message: '修改文章成功',
        loading: false,
        autoClose: 2000,
      });

      formApi.reset();

      onClose();

      ctx.queryClient.invalidateQueries({
        queryKey: [CATEGORY_LIST_QUERY_KEY],
      });
    },
    onError: (error, _var, context) => {
      notifications.update({
        id: context,
        color: 'red',
        title: '修改文章失败',
        message: error.message,
        loading: false,
        autoClose: 2000,
      });
    },
  });

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isAddCategoryPending || isUpdateCategoryPending}
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
                label="标题"
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
                placeholder="合规经营依法纳税 护航企业高质量发展"
                description="标题只能包含中文"
              />
            );
          }}
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
              description="描述不能超过512个字符"
              maxLength={512}
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

export default AddOrUpdateCategoryModalChildren;
