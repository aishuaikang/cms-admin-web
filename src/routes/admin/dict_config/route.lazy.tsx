import { useRef, useState } from 'react';
import React from 'react';
import {
  deleteDictMutationFn,
  DICT_LIST_QUERY_KEY,
  getDictListQueryOptions,
} from '@/apis/dict';
import { Dict } from '@/apis/dict/types';
import { Route as AdminDictConfigRoute } from '@/routes/admin/dict_config/route';
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Menu,
  Table,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconChevronDown,
  IconDots,
  IconPencil,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useRouteContext } from '@tanstack/react-router';
import { useCreation, useMemoizedFn } from 'ahooks';
import AddOrUpdateDictModal, {
  AddOrUpdateDictModalRef,
} from '@/components/admin/dict/AddOrUpdateDictModal';
import EmptyComponent from '@components/EmptyComponent';
import ErrorComponent from '@components/ErrorComponent';
import LoadingComponent from '@components/LoadingComponent';

export const Route = createLazyFileRoute('/admin/dict_config')({
  component: DictConfig,
});

export type DictTreeItem = Dict & {
  children?: DictTreeItem[];
};

function RecursiveMenuRows({
  tree,
  expandedList,
  setExpandedList,
  onAddSubMenu,
  onUpdateMenu,
}: {
  tree: DictTreeItem[];
  expandedList: Dict['id'][];
  setExpandedList: React.Dispatch<React.SetStateAction<Dict['id'][]>>;
  onAddSubMenu: (parentMenu: DictTreeItem) => void;
  onUpdateMenu: (currentMenu: DictTreeItem) => void;
}) {
  const ctx = useRouteContext({ from: AdminDictConfigRoute.to });

  const { mutateAsync: deleteMenuMutation } = useMutation({
    mutationFn: deleteDictMutationFn,
    onMutate: () => {
      return notifications.show({
        loading: true,
        message: '请稍等片刻，正在删除字典',
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: (_data, _var, context) => {
      notifications.update({
        id: context,
        color: 'green',
        message: '删除字典成功',
        loading: false,
        autoClose: 2000,
      });

      ctx.queryClient.invalidateQueries({
        queryKey: [DICT_LIST_QUERY_KEY],
      });
    },
    onError: (error, _var, context) => {
      notifications.update({
        id: context,
        color: 'red',
        title: '删除字典失败',
        message: error.message,
        loading: false,
        autoClose: 2000,
      });
    },
  });
  return (
    <>
      {tree.map((item) => (
        <React.Fragment key={item.id}>
          <Table.Tr>
            <Table.Td w={32}>
              {item.children ? (
                <IconChevronDown
                  className="cursor-pointer"
                  onClick={() => {
                    if (expandedList.includes(item.id)) {
                      setExpandedList((prev) =>
                        prev.filter((id) => id !== item.id)
                      );
                    } else {
                      setExpandedList((prev) => [...prev, item.id]);
                    }
                  }}
                  size={14}
                  style={{
                    transform: !expandedList.includes(item.id)
                      ? 'rotate(270deg)'
                      : 'rotate(0deg)',
                  }}
                />
              ) : null}
            </Table.Td>
            <Table.Td miw={80}>{item.code}</Table.Td>
            <Table.Td miw={80}>{item.name}</Table.Td>
            <Table.Td>{item.extra}</Table.Td>
            <Table.Td>{item.description || '-'}</Table.Td>
            <Table.Td w={100}>
              <Group justify="center">
                <Tooltip label="添加子字典">
                  <ActionIcon
                    variant="subtle"
                    onClick={() => onAddSubMenu(item)}
                  >
                    <IconPlus size={16} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
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
                    <Menu.Label>更多操作</Menu.Label>
                    <Menu.Item
                      leftSection={<IconPencil size={14} />}
                      onClick={() => onUpdateMenu(item)}
                    >
                      修改
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<IconTrash size={14} />}
                      onClick={() => {
                        modals.openConfirmModal({
                          title: '删除字典',
                          centered: true,
                          children: (
                            <Text size="sm">
                              你确定要删除这个字典吗？这将无法恢复。
                            </Text>
                          ),
                          labels: {
                            confirm: '删除',
                            cancel: '取消',
                          },
                          confirmProps: { color: 'red' },
                          onConfirm: () => deleteMenuMutation(item.id),
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
          {expandedList.includes(item.id) && item.children ? (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Table highlightOnHover withTableBorder withColumnBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th></Table.Th>
                      <Table.Th>字典Code</Table.Th>
                      <Table.Th>字典名称</Table.Th>
                      <Table.Th>字典Extra</Table.Th>
                      <Table.Th>字典描述</Table.Th>
                      <Table.Th>操作</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <RecursiveMenuRows
                      tree={item.children}
                      expandedList={expandedList}
                      setExpandedList={setExpandedList}
                      onAddSubMenu={onAddSubMenu}
                      onUpdateMenu={onUpdateMenu}
                    />
                  </Table.Tbody>
                </Table>
              </Table.Td>
            </Table.Tr>
          ) : null}
        </React.Fragment>
      ))}
    </>
  );
}

function DictConfig() {
  const ctx = useRouteContext({ from: AdminDictConfigRoute.to });

  const { isError, error, data, isFetching } = useQuery(
    getDictListQueryOptions()
  );

  const addOrUpdateDictModalRef = useRef<AddOrUpdateDictModalRef>(null);

  // menu列表递归为树
  const tree = useCreation<DictTreeItem[]>(() => {
    const tree: DictTreeItem[] = [];
    const menuMap = new Map<string, DictTreeItem>();
    data?.forEach((item) => {
      menuMap.set(item.id, item);
    });
    data?.forEach((item) => {
      if (item.parentId !== null) {
        const parentMenu = menuMap.get(item.parentId);
        if (parentMenu) {
          if (!parentMenu.children) {
            parentMenu.children = [];
          }
          parentMenu.children.push(item);
        }
      } else {
        tree.push(item);
      }
    });
    return tree;
  }, [data]);

  const [expandedList, setExpandedList] = useState<Dict['id'][]>([]);

  const renderTable = useMemoizedFn(() => {
    if (isFetching) return <LoadingComponent />;

    if (isError)
      return <ErrorComponent title="获取字典列表失败" error={error.message} />;

    if (data?.length === 0) return <EmptyComponent />;

    return (
      <Table.ScrollContainer
        minWidth={1000}
        h={'calc(100% - 30px - 33px)'}
        //   className="[&>.mantine-ScrollArea-scrollbar]:z-[3]"
      >
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th></Table.Th>
              <Table.Th>字典Code</Table.Th>
              <Table.Th>字典名称</Table.Th>
              <Table.Th>字典Extra</Table.Th>
              <Table.Th>字典描述</Table.Th>
              <Table.Th>操作</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <RecursiveMenuRows
              tree={tree}
              expandedList={expandedList}
              setExpandedList={setExpandedList}
              onAddSubMenu={(parentMenu) =>
                addOrUpdateDictModalRef.current?.open(false, parentMenu)
              }
              onUpdateMenu={(currentMenu) =>
                addOrUpdateDictModalRef.current?.open(true, currentMenu)
              }
            />
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    );
  });

  return (
    <>
      <Group justify="space-between">
        <Title order={2} size={'h4'}>
          {ctx.title}
        </Title>
        <Group>
          <Button
            variant="light"
            leftSection={<IconPlus size={16} />}
            size="xs"
            onClick={() => addOrUpdateDictModalRef.current?.open(false)}
          >
            添加顶级字典
          </Button>
        </Group>
      </Group>
      <Divider my="md" />
      {renderTable()}

      <AddOrUpdateDictModal ref={addOrUpdateDictModalRef} />
    </>
  );
}
