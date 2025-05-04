import { useMemo, useRef } from 'react';
import {
  CATEGORY_LIST_QUERY_KEY,
  deleteCategoryMutationFn,
  getCategoryListQueryOptions,
} from '@/apis/category';
import { Route as AdminCategoryRoute } from '@/routes/admin/category/route';
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Table,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useRouteContext } from '@tanstack/react-router';
import { useMemoizedFn } from 'ahooks';
import AddOrUpdateCategoryModal, {
  AddOrUpdateCategoryModalRef,
} from '@/components/admin/category/AddOrUpdateCategoryModal';
import EmptyComponent from '@/components/EmptyComponent';
import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';

export const Route = createLazyFileRoute('/admin/category')({
  component: Category,
});

function Category() {
  const ctx = useRouteContext({ from: AdminCategoryRoute.to });

  const { isError, error, data, isFetching } = useQuery(
    getCategoryListQueryOptions()
  );

  const { mutateAsync: deleteCategoryMutation } = useMutation({
    mutationFn: deleteCategoryMutationFn,
    onMutate: () => {
      return notifications.show({
        loading: true,
        message: '请稍等片刻，正在删除分类',
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: (_data, _var, context) => {
      notifications.update({
        id: context,
        color: 'green',
        message: '删除分类成功',
        loading: false,
        autoClose: 2000,
      });

      ctx.queryClient.invalidateQueries({
        queryKey: [CATEGORY_LIST_QUERY_KEY],
      });
    },
    onError: (error, _var, context) => {
      notifications.update({
        id: context,
        color: 'red',
        title: '删除分类失败',
        message: error.message,
        loading: false,
        autoClose: 2000,
      });
    },
  });

  const rows = useMemo(() => {
    return data?.map((category) => (
      <Table.Tr key={category.id}>
        <Table.Td miw={200}>{category.name}</Table.Td>
        <Table.Td miw={300}>{category.description || '-'}</Table.Td>
        <Table.Td w={100}>
          <Group justify="center">
            <Tooltip label="修改分类">
              <ActionIcon
                variant="subtle"
                onClick={() =>
                  addOrUpdateCategoryModalRef.current?.open(category)
                }
              >
                <IconPencil size={16} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="删除分类">
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => {
                  modals.openConfirmModal({
                    title: '删除分类',
                    centered: true,
                    children: (
                      <Text size="sm">
                        你确定要删除这个分类吗？这将无法恢复。
                      </Text>
                    ),
                    labels: {
                      confirm: '删除',
                      cancel: '取消',
                    },
                    confirmProps: { color: 'red' },
                    onConfirm: () => deleteCategoryMutation(category.id),
                  });
                }}
              >
                <IconTrash size={16} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));
  }, [data, deleteCategoryMutation]);

  const renderTable = useMemoizedFn(() => {
    if (isFetching) return <LoadingComponent />;

    if (isError)
      return <ErrorComponent title="获取分类列表失败" error={error.message} />;

    if (data?.length === 0) return <EmptyComponent />;

    return (
      <Table.ScrollContainer
        minWidth={1000}
        h={'calc(100% - 30px - 33px)'}
        className="[&>.mantine-ScrollArea-scrollbar]:z-[3]"
      >
        <Table
          striped
          //   stickyHeader
          //   stickyHeaderOffset={0}
          highlightOnHover
          withTableBorder
          withColumnBorders
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>名称</Table.Th>
              <Table.Th>描述</Table.Th>
              <Table.Th>操作</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    );
  });

  const addOrUpdateCategoryModalRef = useRef<AddOrUpdateCategoryModalRef>(null);

  return (
    <>
      {/* <Searchbar
        isLoading={isFetching}
        onSearch={async (value) => {
          setSearchValue(value);
        }}
        onReset={() => {
          setSearchValue(undefined);
        }}
      />
      <Divider my="md" /> */}
      <Group justify="space-between">
        <Title order={2} size={'h4'}>
          {ctx.title}
        </Title>
        <Button
          variant="light"
          leftSection={<IconPlus size={16} />}
          size="xs"
          onClick={() => addOrUpdateCategoryModalRef.current?.open()}
        >
          添加
        </Button>
      </Group>
      <Divider my="md" />
      {renderTable()}
      <AddOrUpdateCategoryModal ref={addOrUpdateCategoryModalRef} />
    </>
  );
}
