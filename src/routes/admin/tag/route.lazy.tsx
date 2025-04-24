import { useRef } from 'react';
import {
  deleteTagMutationFn,
  getTagListQueryOptions,
  TAG_LIST_QUERY_KEY,
} from '@/apis/tag';
import { Route as AdminTagRoute } from '@/routes/admin/tag/route';
import {
  Button,
  Divider,
  Group,
  Pill,
  ScrollArea,
  Text,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useRouteContext } from '@tanstack/react-router';
import { useMemoizedFn } from 'ahooks';
import AddOrUpdateTagModal, {
  AddOrUpdateTagModalRef,
} from '@/components/admin/tag/AddOrUpdateTagModal';
import EmptyComponent from '@/components/EmptyComponent';
import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';

export const Route = createLazyFileRoute('/admin/tag')({
  component: Tag,
});

function Tag() {
  const ctx = useRouteContext({ from: AdminTagRoute.to });

  const { isError, error, data, isFetching } = useQuery(
    getTagListQueryOptions()
  );

  const { mutateAsync: deleteTagMutation } = useMutation({
    mutationFn: deleteTagMutationFn,
    onMutate: () => {
      return notifications.show({
        loading: true,
        message: '请稍等片刻，正在删除标签',
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: (_data, _var, context) => {
      notifications.update({
        id: context,
        color: 'green',
        message: '删除标签成功',
        loading: false,
        autoClose: 2000,
      });

      ctx.queryClient.invalidateQueries({
        queryKey: [TAG_LIST_QUERY_KEY],
      });
    },
    onError: (error, _var, context) => {
      notifications.update({
        id: context,
        color: 'red',
        title: '删除标签失败',
        message: error.message,
        loading: false,
        autoClose: 2000,
      });
    },
  });

  const renderTags = useMemoizedFn(() => {
    if (isFetching) return <LoadingComponent />;

    if (isError)
      return <ErrorComponent title="获取标签列表失败" error={error.message} />;

    if (data?.length === 0) return <EmptyComponent />;

    return (
      <ScrollArea
        h={'calc(100% - 30px - 33px)'}
        className="[&>.mantine-ScrollArea-scrollbar]:z-[3]"
      >
        <Group>
          {data?.map((tag) => (
            <Pill
              key={tag.id}
              className="cursor-pointer"
              onClick={() => {
                addOrUpdateTagModalRef.current?.open(tag);
              }}
              withRemoveButton
              onRemove={() => {
                modals.openConfirmModal({
                  title: '删除标签',
                  centered: true,
                  children: (
                    <Text size="sm">
                      你确定要删除这个标签吗？这将无法恢复。
                    </Text>
                  ),
                  labels: {
                    confirm: '删除',
                    cancel: '取消',
                  },
                  confirmProps: { color: 'red' },
                  onConfirm: () => deleteTagMutation(tag.id),
                });
              }}
            >
              {tag.name}({tag.articles.length})
            </Pill>
          ))}
        </Group>
      </ScrollArea>
    );
  });

  const addOrUpdateTagModalRef = useRef<AddOrUpdateTagModalRef>(null);

  return (
    <>
      <Group justify="space-between">
        <Title order={2} size={'h4'}>
          {ctx.title}
        </Title>
        <Button
          variant="light"
          leftSection={<IconPlus size={16} />}
          size="xs"
          onClick={() => addOrUpdateTagModalRef.current?.open()}
        >
          添加
        </Button>
      </Group>
      <Divider my="md" />
      {renderTags()}
      <AddOrUpdateTagModal ref={addOrUpdateTagModalRef} />
    </>
  );
}
