import {
  addArticleMutationFn,
  ARTICLE_LIST_QUERY_KEY,
  updateArticleMutationFn,
} from '@/apis/article';
import { Article } from '@/apis/article/types';
import { Route as AdminArticleRoute } from '@/routes/admin/article/route';
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
    .max(15, '文章名称不能超过15个字符')
    .regex(/^[\u4e00-\u9fa5]+$/, '文章名称只能包含中文'),
  description: z.string().trim().max(512, '接口权限不能超过512个字符'),
  url: z
    .string()
    .trim()
    .nonempty('链接不能为空')
    .min(2, '链接不能少于2个字符')
    .max(150, '链接不能超过150个字符')
    .regex(/^(http|https):\/\/[^\s]+$/, '链接格式不正确'),
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
        // image: undefined,
        url: '',
      };
    return {
      title: currentArticle.title,
      description: currentArticle.description,
      //   image: currentArticle.image,
      //   url: currentArticle.url,
    };
  });

  const formApi = useForm({
    defaultValues: defaultValues(),
    onSubmit: async ({ value }) => {
      if (currentArticle) {
        // await updateArticleMutation({
        //   articleId: currentArticle.id,
        //   data: {
        //     ...value,
        //     type: ArticleType.外部链接,
        //     channel: ArticleChannel.行业新闻,
        //     operate: ArticleOperate.保存发布,
        //   },
        // });
      } else {
        // await addArticleMutation({
        //   ...value,
        //   type: ArticleType.外部链接,
        //   channel: ArticleChannel.行业新闻,
        //   operate: ArticleOperate.保存发布,
        // });
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
        {/* <formApi.Field
          name="type"
          children={({ name, state, handleChange, handleBlur }) => {
            return (
              <Radio.Group
                withAsterisk
                label="文章类型"
                name={name}
                value={state.value}
                onBlur={handleBlur}
                onChange={(e) => handleChange(e as 'page' | 'button')}
                error={state.meta.errors[0]?.message}
                description="用于在文章中区分展示不同类型的图标"
              >
                <Group mt="xs">
                  <Radio value="page" label="页面" />
                  <Radio value="button" label="按钮" />
                </Group>
              </Radio.Group>
            );
          }}
        /> */}
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

        {/* <formApi.Field
          name="image"
          children={({ name, state, handleChange, handleBlur }) => (
            <FileInput
              withAsterisk
              label="摘要"
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
              placeholder="新闻摘要"
              description="摘要只能包含中文"
            />
          )}
        /> */}
        <formApi.Field
          name="url"
          children={({ name, state, handleChange, handleBlur }) => (
            <TextInput
              withAsterisk
              label="外链"
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
              placeholder="http://shanxi.chinatax.gov.cn/web/detail/sx-11400-589-1801419"
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
