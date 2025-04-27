import {
  addArticleMutationFn,
  ARTICLE_LIST_QUERY_KEY,
  updateArticleMutationFn,
} from '@/apis/article';
import { Article, ArticleStatus } from '@/apis/article/types';
import { Route as AdminArticleRoute } from '@/routes/admin/article/route';
import { getEnumOptions } from '@/utils';
import {
  Box,
  Button,
  Group,
  Input,
  LoadingOverlay,
  Radio,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext } from '@tanstack/react-router';
import { useMemoizedFn } from 'ahooks';
import { z } from 'zod';
import CategorySelect from '@/components/CategorySelect';
import { RichTextEditor } from '@/components/RichTextEditor';
import TagSelect from '@/components/TagSelect';

export interface AddOrUpdateArticleModalChildrenProps {
  onClose: () => void;
  currentArticle?: Article;
}

const rules = z.object({
  title: z
    .string()
    .trim()
    .nonempty('标题不能为空')
    .min(2, '标题不能少于2个字符')
    .max(50, '文章名称不能超过50个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, '禁止使用特殊字符'),

  content: z.string().nonempty('内容不能为空'),
  category_id: z.string().trim().nonempty('分类不能为空'),
  status: z.number().min(0, '状态不能为空').max(1, '状态不能为空'),
  tag_ids: z.array(z.string()).nullable(),

  //   id: context,

  //   url: z
  //     .string()
  //     .trim()
  //     .nonempty('链接不能为空')
  //     .min(2, '链接不能少于2个字符')
  //     .max(150, '链接不能超过150个字符')
  //     .regex(/^(http|https):\/\/[^\s]+$/, '链接格式不正确'),
});

// type FormValues = z.infer<typeof rules>;

const AddOrUpdateArticleModalChildren: React.FC<
  AddOrUpdateArticleModalChildrenProps
> = ({ onClose, currentArticle }) => {
  const ctx = useRouteContext({ from: AdminArticleRoute.to });

  const defaultValues = useMemoizedFn(() => {
    if (!currentArticle)
      return {
        title: '',
        content: '',
        category_id: '',
        status: ArticleStatus.公开 as number,
        // image: undefined,
        tag_ids: null as string[] | null,
      };
    return {
      title: currentArticle.title,
      content: currentArticle.content,
      category_id: currentArticle.category_id,
      status: currentArticle.status as number,
      tag_ids: currentArticle.tags?.map((item) => item.id) || null,
      //   image: currentArticle.image,

      //   url: currentArticle.url,
    };
  });

  const formApi = useForm({
    defaultValues: defaultValues(),
    onSubmit: async ({ value }) => {
      console.log(value);
      if (currentArticle) {
        await updateArticleMutation({
          id: currentArticle.id,
          ...value,
          status: value.status as unknown as ArticleStatus,
          image_ids: null,
          description: value.content.slice(0, 50),
        });
      } else {
        await addArticleMutation({
          ...value,
          status: value.status as unknown as ArticleStatus,
          image_ids: null,
          description: value.content.slice(0, 50),
        });
      }
    },
    validators: {
      onChange: rules,
    },
  });

  const { mutateAsync: addArticleMutation, isPending: isAddArticlePending } =
    useMutation({
      mutationFn: addArticleMutationFn,
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
          queryKey: [ARTICLE_LIST_QUERY_KEY],
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
    mutateAsync: updateArticleMutation,
    isPending: isUpdateArticlePending,
  } = useMutation({
    mutationFn: updateArticleMutationFn,
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
        queryKey: [ARTICLE_LIST_QUERY_KEY],
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
        visible={isAddArticlePending || isUpdateArticlePending}
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
          name="title"
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
                description="不能超过50个字符，禁止使用特殊字符"
              />
            );
          }}
        />

        <formApi.Field
          name="category_id"
          children={({ name, state, handleChange, handleBlur }) => {
            return (
              <CategorySelect
                withAsterisk
                name={name}
                value={state.value}
                onBlur={handleBlur}
                onChange={(value) => handleChange(value ?? '')}
                error={state.meta.errors[0]?.message}
              />
            );
          }}
        />
        <formApi.Field
          name="content"
          children={({ state, handleChange }) => (
            <Stack gap={'xs'}>
              <RichTextEditor value={state.value} onChange={handleChange} />
              {state.meta.errors[0]?.message && (
                <Text className="text-red-500" size="xs">
                  {state.meta.errors[0]?.message}
                </Text>
              )}
            </Stack>
          )}
        />

        <formApi.Field
          name="status"
          children={({ name, state, handleChange, handleBlur }) => (
            <Radio.Group
              withAsterisk
              label="状态"
              variant="filled"
              name={name}
              onBlur={handleBlur}
              value={state.value as unknown as string}
              onChange={(e) => {
                handleChange(parseInt(e));
              }}
              error={state.meta.errors[0]?.message}
            >
              <Group mt="xs" mb="xs">
                {getEnumOptions(ArticleStatus).map((item) => {
                  return (
                    <Radio
                      value={item.value}
                      label={item.label}
                      key={item.value}
                    />
                  );
                })}
              </Group>
            </Radio.Group>
          )}
        />

        <formApi.Field
          name="tag_ids"
          children={({ name, state, handleChange, handleBlur }) => (
            <TagSelect
              name={name}
              onBlur={handleBlur}
              value={state.value ?? []}
              onChange={(e) => {
                console.log();
                handleChange(e);
              }}
              error={state.meta.errors[0]?.message}
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

export default AddOrUpdateArticleModalChildren;
