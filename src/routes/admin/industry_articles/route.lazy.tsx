import { useMemo, useRef, useState } from 'react';
import {
  ARTICLE_LIST_QUERY_KEY,
  deleteArticleMutationFn,
  getArticleListQueryOptions,
} from '@/apis/articles';
import {
  ArticleChannel,
  ArticleStatus,
  ArticleType,
} from '@/apis/articles/types';
import { Route as AdminIndustryArticlesRoute } from '@/routes/admin/industry_articles/route';
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Menu,
  Pagination,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconDots, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useRouteContext } from '@tanstack/react-router';
import { useMemoizedFn } from 'ahooks';
import AddOrUpdateArticleModal, {
  AddOrUpdateArticleModalRef,
} from '@/components/admin/industry_articles/AddOrUpdateArticleModal';
import Searchbar, {
  SearchValue,
} from '@/components/admin/industry_articles/Searchbar';
import EmptyComponent from '@/components/EmptyComponent';
import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';

export const Route = createLazyFileRoute('/admin/industry_articles')({
  component: IndustryArticles,
});

function IndustryArticles() {
  const ctx = useRouteContext({ from: AdminIndustryArticlesRoute.to });

  const [pageNum, setPageNum] = useState(1);

  const [searchValue, setSearchValue] = useState<SearchValue>();

  const { isError, error, data, isFetching } = useQuery(
    getArticleListQueryOptions({
      pageNum,
      pageSize: import.meta.env.VITE_COMMON_PAGE_SIZE,
      channel: ArticleChannel.行业新闻,
      status: (searchValue?.status as unknown as ArticleStatus) ?? undefined,
      keyword: searchValue?.keyword ?? undefined,
    })
  );

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
    return data?.rows?.map((article) => (
      <Table.Tr key={article.id}>
        <Table.Td miw={200}>{article.title}</Table.Td>
        <Table.Td miw={300}>{article.description}</Table.Td>
        <Table.Td miw={100} align="center">
          {ArticleType[article.type]}
        </Table.Td>
        <Table.Td miw={50} align="center">
          <Button
            size="xs"
            variant="transparent"
            component="a"
            href={article.url}
            target="_blank"
          >
            查看
          </Button>
        </Table.Td>
        <Table.Td miw={100} align="center">
          {article.publishTime || '-'}
        </Table.Td>
        <Table.Td w={100}>
          <Group justify="center">
            {/* <Tooltip label="分配文章">
              <ActionIcon variant="subtle">
                <IconPointerShare size={16} stroke={1.5} />
              </ActionIcon>
            </Tooltip> */}

            <Menu
              shadow="md"
              withOverlay
              overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
              }}
              withArrow
              position="bottom-end"
              withinPortal={false}
            >
              <Menu.Target>
                <ActionIcon variant="subtle" aria-label="更多操作">
                  <IconDots size={16} stroke={1.5} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconPencil size={14} />}
                  onClick={() =>
                    addOrUpdateArticleModalRef.current?.open(article)
                  }
                >
                  修改
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={14} />}
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
                >
                  删除
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));
  }, [data?.rows, deleteArticleMutation]);

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
              <Table.Th>摘要</Table.Th>
              <Table.Th>类型</Table.Th>
              <Table.Th>外链</Table.Th>
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
          console.log(value);
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
        value={pageNum}
        onChange={setPageNum}
      />
      <AddOrUpdateArticleModal ref={addOrUpdateArticleModalRef} />
    </>
  );
}
