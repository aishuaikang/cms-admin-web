import { useRef } from 'react';
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
  Container,
  Group,
  Input,
  LoadingOverlay,
  Radio,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext } from '@tanstack/react-router';
import { useMemoizedFn } from 'ahooks';
import { z } from 'zod';
import CategorySelect from '@/components/CategorySelect';
import { RichTextEditor, RichTextEditorRef } from '@/components/RichTextEditor';
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

  description: z
    .string()
    .trim()
    .nonempty('描述不能为空')
    .min(2, '描述不能少于2个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, '禁止使用特殊字符')
    .max(256, '描述不能超过256个字符'),
  content: z.string().nonempty('内容不能为空'),
  categoryId: z.string().trim().nonempty('分类不能为空'),
  status: z.number().min(0, '状态不能为空').max(1, '状态不能为空'),
  tagIds: z.array(z.string()).nullable(),

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
        description: '',
        content: '',
        categoryId: '',
        status: ArticleStatus.草稿 as number,
        // image: undefined,
        tagIds: null as string[] | null,
      };
    return {
      title: currentArticle.title,
      description: currentArticle.description,
      content: currentArticle.content,
      categoryId: currentArticle.categoryId,
      status: currentArticle.status as number,
      tagIds: currentArticle.tags?.map((item) => item.id) || null,
      //   image: currentArticle.image,

      //   url: currentArticle.url,
    };
  });

  const formApi = useForm({
    defaultValues: defaultValues(),
    onSubmit: async ({ value }) => {
      if (!richTextEditorRef.current) {
        notifications.show({
          color: 'red',
          title: '错误',
          message: '富文本编辑器未加载',
        });
        return;
      }
      //   const text = richTextEditorRef.current.getText();
      const json = richTextEditorRef.current.getJson();
      const imagesAttrs =
        json?.content
          ?.filter((item) => item.type === 'image' && item.attrs?.src)
          .map((item) => {
            const src = item.attrs?.src;
            if (typeof src !== 'string') {
              console.warn('Invalid src:', src);
              return null;
            }
            const regex = /[a-f\d]{4}(?:[a-f\d]{4}-){4}[a-f\d]{12}/i;

            // 在src中匹配出ID
            const match = src.match(regex);
            return match ? match[0] : null;
          })
          .filter((id) => id !== null) || [];

      if (currentArticle) {
        await updateArticleMutation({
          id: currentArticle.id,
          ...value,
          status: value.status as unknown as ArticleStatus,
          imageIds: imagesAttrs,
          //   description: text?.slice(0, 256) || '',
        });
      } else {
        await addArticleMutation({
          ...value,
          status: value.status as unknown as ArticleStatus,
          imageIds: imagesAttrs,
          //   description: text?.slice(0, 256) || '',
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

  const richTextEditorRef = useRef<RichTextEditorRef>(null);

  return (
    <Container size={'xl'} pos="relative">
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
        onReset={() => {
          formApi.reset();
          richTextEditorRef.current?.setContent(defaultValues().content);
        }}
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
                placeholder="标题"
                description="不能超过50个字符，禁止使用特殊字符"
              />
            );
          }}
        />

        <formApi.Field
          name="description"
          children={({ name, state, handleChange, handleBlur }) => (
            <Textarea
              withAsterisk
              label="描述"
              variant="filled"
              name={name}
              value={state.value}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e.target.value)}
              error={state.meta.errors[0]?.message}
              rightSection={
                <Group>
                  {state.value !== '' ? (
                    <Input.ClearButton onClick={() => handleChange('')} />
                  ) : undefined}
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      const text = richTextEditorRef.current
                        ?.getText()
                        ?.replace(/\s+/g, '')
                        ?.trim()
                        ?.slice(0, 256);
                      handleChange(text ?? '');
                    }}
                  >
                    根据内容生成
                  </Button>
                </Group>
              }
              rightSectionWidth={160}
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

        <formApi.Field
          name="categoryId"
          children={({ name, state, handleChange, handleBlur }) => {
            return (
              <CategorySelect
                label="分类"
                description="用于区分文章的分类"
                placeholder="选择分类"
                variant="filled"
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
          name="tagIds"
          children={({ name, state, handleChange, handleBlur }) => (
            <TagSelect
              name={name}
              onBlur={handleBlur}
              value={state.value ?? []}
              onChange={(e) => {
                handleChange(e);
              }}
              error={state.meta.errors[0]?.message}
            />
          )}
        />

        <formApi.Field
          name="content"
          children={({ state, handleChange }) => (
            <Stack gap={'xs'}>
              <RichTextEditor
                ref={richTextEditorRef}
                value={state.value}
                onChange={handleChange}
              />
              {state.meta.errors[0]?.message && (
                <Text c={'red'} size="xs">
                  {state.meta.errors[0]?.message}
                </Text>
              )}
            </Stack>
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
    </Container>
  );
};

export default AddOrUpdateArticleModalChildren;
