import {
  addTagMutationFn,
  TAG_LIST_QUERY_KEY,
  updateTagMutationFn,
} from '@/apis/tag';
import { Tag } from '@/apis/tag/types';
import { Route as AdminTagRoute } from '@/routes/admin/tag/route';
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

export interface AddOrUpdateTagModalChildrenProps {
  onClose: () => void;
  currentTag?: Tag;
}

const rules = z.object({
  name: z
    .string()
    .trim()
    .nonempty('名称不能为空')
    .min(2, '名称不能少于2个字符')
    .max(15, '名称不能超过15个字符'),
  description: z.string().trim().max(256, '描述不能超过256个字符'),
});

const AddOrUpdateTagModalChildren: React.FC<
  AddOrUpdateTagModalChildrenProps
> = ({ onClose, currentTag }) => {
  const ctx = useRouteContext({ from: AdminTagRoute.to });

  const defaultValues = useMemoizedFn(() => {
    if (!currentTag)
      return {
        name: '',
        description: '',
      };
    return {
      name: currentTag.name,
      description: currentTag.description,
    };
  });

  const formApi = useForm({
    defaultValues: defaultValues(),
    onSubmit: async ({ value }) => {
      if (currentTag) {
        await updateTagMutation({
          id: currentTag.id,
          ...value,
        });
      } else {
        await addTagMutation(value);
      }
    },
    validators: {
      onChange: rules,
    },
  });

  const { mutateAsync: addTagMutation, isPending: isAddTagPending } =
    useMutation({
      mutationFn: addTagMutationFn,
      onMutate: () => {
        return notifications.show({
          loading: true,
          message: '请稍等片刻，正在添加标签',
          autoClose: false,
          withCloseButton: false,
        });
      },
      onSuccess: (_data, _var, context) => {
        notifications.update({
          id: context,
          color: 'green',
          message: '添加标签成功',
          loading: false,
          autoClose: 2000,
        });

        formApi.reset();

        onClose();

        ctx.queryClient.invalidateQueries({
          queryKey: [TAG_LIST_QUERY_KEY],
        });
      },
      onError: (error, _var, context) => {
        notifications.update({
          id: context,
          color: 'red',
          title: '添加标签失败',
          message: error.message,
          loading: false,
          autoClose: 2000,
        });
      },
    });

  const { mutateAsync: updateTagMutation, isPending: isUpdateTagPending } =
    useMutation({
      mutationFn: updateTagMutationFn,
      onMutate: () => {
        return notifications.show({
          loading: true,
          message: '请稍等片刻，正在修改标签',
          autoClose: false,
          withCloseButton: false,
        });
      },
      onSuccess: (_data, _var, context) => {
        notifications.update({
          id: context,
          color: 'green',
          message: '修改标签成功',
          loading: false,
          autoClose: 2000,
        });

        formApi.reset();

        onClose();

        ctx.queryClient.invalidateQueries({
          queryKey: [TAG_LIST_QUERY_KEY],
        });
      },
      onError: (error, _var, context) => {
        notifications.update({
          id: context,
          color: 'red',
          title: '修改标签失败',
          message: error.message,
          loading: false,
          autoClose: 2000,
        });
      },
    });

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isAddTagPending || isUpdateTagPending}
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

export default AddOrUpdateTagModalChildren;
