import { useMemo, useRef, useState } from 'react';
import {
  ARTICLE_LIST_QUERY_KEY,
  deleteArticleMutationFn,
  getArticleListQueryOptions,
} from '@/apis/article';
import { ArticleStatus } from '@/apis/article/types';
import { getCategoryListQueryOptions } from '@/apis/category';
import { Route as AdminArticleRoute } from '@/routes/admin/article/route';
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Pagination,
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
import AddOrUpdateArticleModal, {
  AddOrUpdateArticleModalRef,
} from '@/components/admin/article/AddOrUpdateArticleModal';
import Searchbar, { SearchValue } from '@/components/admin/article/Searchbar';
import EmptyComponent from '@/components/EmptyComponent';
import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';

export const Route = createLazyFileRoute('/admin/article')({
  component: IndustryArticles,
});

function IndustryArticles() {
  const ctx = useRouteContext({ from: AdminArticleRoute.to });

  const [page, setPage] = useState(1);

  const [searchValue, setSearchValue] = useState<SearchValue>();

  const { isError, error, data, isFetching } = useQuery(
    getArticleListQueryOptions({
      page,
      pageSize: import.meta.env.VITE_COMMON_PAGE_SIZE,
      title: searchValue?.title,
      status: searchValue?.status ?? undefined,
      categoryId: searchValue?.categoryId ?? undefined,
    })
  );

  const {
    isError: isCategoryError,
    error: categoryError,
    data: categoryList,
    isFetching: isCategoryFetching,
  } = useQuery(getCategoryListQueryOptions());

  const { mutateAsync: deleteArticleMutation } = useMutation({
    mutationFn: deleteArticleMutationFn,
    onMutate: () => {
      return notifications.show({
        loading: true,
        message: '请稍等片刻，正在删除文章',
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: (_data, _var, context) => {
      notifications.update({
        id: context,
        color: 'green',
        message: '删除文章成功',
        loading: false,
        autoClose: 2000,
      });

      ctx.queryClient.invalidateQueries({
        queryKey: [ARTICLE_LIST_QUERY_KEY],
      });
    },
    onError: (error, _var, context) => {
      notifications.update({
        id: context,
        color: 'red',
        title: '删除文章失败',
        message: error.message,
        loading: false,
        autoClose: 2000,
      });
    },
  });

  const rows = useMemo(() => {
    return data?.rows.map((article) => (
      <Table.Tr key={article.id}>
        <Table.Td miw={100}>
          <Tooltip label={article.title} withArrow position="top-start">
            <Text lineClamp={1} size="sm">
              {article.title}
            </Text>
          </Tooltip>
        </Table.Td>
        <Table.Td>
          <Tooltip label={article.title} withArrow position="top-start">
            <Text lineClamp={1} size="sm">
              {article.description}
            </Text>
          </Tooltip>
        </Table.Td>
        <Table.Td w={200} align="center">
          {(() => {
            if (isCategoryFetching) return <LoadingComponent />;

            if (isCategoryError)
              return (
                <ErrorComponent
                  title="获取分类列表失败"
                  error={categoryError.message}
                />
              );

            const category = categoryList?.find(
              (category) => category.id === article.categoryId
            );
            return category?.name || '-';
          })()}
        </Table.Td>
        <Table.Td w={100} align="center">
          {ArticleStatus[article.status]}
        </Table.Td>
        <Table.Td w={200} align="center">
          {article.createdAt}
        </Table.Td>

        <Table.Td w={100}>
          <Group justify="center">
            <Tooltip label="修改文章">
              <ActionIcon
                variant="subtle"
                onClick={() =>
                  addOrUpdateArticleModalRef.current?.open(article)
                }
              >
                <IconPencil size={16} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="删除文章">
              <ActionIcon
                variant="subtle"
                onClick={() => {
                  modals.openConfirmModal({
                    title: '删除文章',
                    centered: true,
                    children: (
                      <Text size="sm">
                        你确定要删除这个文章吗？这将无法恢复。
                      </Text>
                    ),
                    labels: {
                      confirm: '删除',
                      cancel: '取消',
                    },
                    confirmProps: { color: 'red' },
                    onConfirm: () => deleteArticleMutation(article.id),
                  });
                }}
                c={'red'}
              >
                <IconTrash size={16} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));
  }, [
    categoryError,
    categoryList,
    data?.rows,
    deleteArticleMutation,
    isCategoryError,
    isCategoryFetching,
  ]);

  const renderTable = useMemoizedFn(() => {
    if (isFetching) return <LoadingComponent />;

    if (isError)
      return <ErrorComponent title="获取文章列表失败" error={error.message} />;

    if (data?.total === 0) return <EmptyComponent />;

    return (
      <Table.ScrollContainer
        minWidth={1000}
        h={'calc(100% - 56px - 33px - 30px - 33px - 33px - 32px)'}
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
              <Table.Th>标题</Table.Th>
              <Table.Th>描述</Table.Th>
              <Table.Th>分类</Table.Th>
              <Table.Th>状态</Table.Th>
              {/* <Table.Th>外链</Table.Th> */}
              <Table.Th>发布时间</Table.Th>
              <Table.Th>操作</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    );
  });

  const addOrUpdateArticleModalRef = useRef<AddOrUpdateArticleModalRef>(null);

  return (
    <>
      <Searchbar
        isLoading={isFetching}
        onSearch={async (value) => {
          setSearchValue(value);
        }}
        onReset={() => {
          setSearchValue(undefined);
        }}
      />
      <Divider my="md" />
      <Group justify="space-between">
        <Title order={2} size={'h4'}>
          {ctx.title}
        </Title>
        <Button
          variant="light"
          leftSection={<IconPlus size={16} />}
          size="xs"
          onClick={() => addOrUpdateArticleModalRef.current?.open()}
        >
          添加
        </Button>
      </Group>
      <Divider my="md" />
      {renderTable()}
      <Divider my="md" />
      <Pagination
        total={data?.pages || 0}
        withEdges
        value={page}
        onChange={setPage}
      />
      <AddOrUpdateArticleModal ref={addOrUpdateArticleModalRef} />
    </>
  );
}
