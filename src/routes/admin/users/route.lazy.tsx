import { useMemo, useRef } from 'react';
import {
  deleteUserMutationFn,
  getUserListQueryOptions,
  USER_LIST_QUERY_KEY,
} from '@/apis/user';
import { Route as AdminUsersRoute } from '@/routes/admin/users/route';
import {
  ActionIcon,
  Avatar,
  Button,
  Divider,
  Group,
  Menu,
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
import AddOrUpdateUserModal, {
  AddOrUpdateUserModalRef,
} from '@/components/admin/users/AddOrUpdateUserModal';
import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import EmptyComponent from '@components/EmptyComponent';

export const Route = createLazyFileRoute('/admin/users')({
  component: Users,
});

function Users() {
  const ctx = useRouteContext({ from: AdminUsersRoute.to });

  const { isError, error, data, isFetching } = useQuery(
    getUserListQueryOptions()
  );

  const { mutateAsync: deleteUserMutation } = useMutation({
    mutationFn: deleteUserMutationFn,
    onMutate: () => {
      return notifications.show({
        loading: true,
        message: '请稍等片刻，正在删除用户',
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: (_data, _var, context) => {
      notifications.update({
        id: context,
        color: 'green',
        message: '删除用户成功',
        loading: false,
        autoClose: 2000,
      });

      ctx.queryClient.invalidateQueries({
        queryKey: [USER_LIST_QUERY_KEY],
      });
    },
    onError: (error, _var, context) => {
      notifications.update({
        id: context,
        color: 'red',
        title: '删除用户失败',
        message: error.message,
        loading: false,
        autoClose: 2000,
      });
    },
  });

  const addOrUpdateUserModalRef = useRef<AddOrUpdateUserModalRef>(null);

  const rows = useMemo(() => {
    return data?.map((user) => (
      <Table.Tr key={user.id}>
        <Table.Td miw={200}>
          <Table.Td>
            <Group gap="sm">
              <Avatar
                size={40}
                src={
                  user?.imageId
                    ? import.meta.env.VITE_BASE_API +
                      `/common/image/download/${
                        user?.imageId
                      }?${new Date().getTime()}`
                    : undefined
                }
                radius={40}
              />
              <div>
                <Text fz="sm" fw={500}>
                  {user.nickname}
                </Text>
                <Text c="dimmed" fz="xs">
                  {user.isSuper ? '超级管理员' : '普通用户'}
                </Text>
              </div>
            </Group>
          </Table.Td>
        </Table.Td>
        <Table.Td miw={300}>
          <Text fz="sm">{user.username}</Text>
          <Text fz="xs" c="dimmed">
            用户名
          </Text>
        </Table.Td>
        <Table.Td>
          <Text fz="sm">{user.phone}</Text>
          <Text fz="xs" c="dimmed">
            手机号
          </Text>
        </Table.Td>
        <Table.Td w={100}>
          <Group justify="center">
            {/* <Tooltip label="分配用户">
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
                  onClick={() => {
                    addOrUpdateUserModalRef.current?.open(user);
                  }}
                >
                  修改
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={14} />}
                  onClick={() => {
                    modals.openConfirmModal({
                      title: '删除用户',
                      centered: true,
                      children: (
                        <Text size="sm">
                          你确定要删除这个用户吗？这将无法恢复。
                        </Text>
                      ),
                      labels: {
                        confirm: '删除',
                        cancel: '取消',
                      },
                      confirmProps: { color: 'red' },
                      onConfirm: () => deleteUserMutation(user.id),
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
  }, [data, deleteUserMutation]);

  const renderTable = useMemoizedFn(() => {
    if (isFetching) return <LoadingComponent />;

    if (isError)
      return <ErrorComponent title="获取用户列表失败" error={error.message} />;

    if (data?.length === 0) return <EmptyComponent />;

    return (
      <Table.ScrollContainer
        minWidth={1000}
        h={'calc(100% - - 30px - 33px)'}
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
          {/* <Table.Thead>
            <Table.Tr>
              <Table.Th>昵称</Table.Th>
              <Table.Th>用户名</Table.Th>
              <Table.Th>手机号</Table.Th>
              <Table.Th>角色</Table.Th>
              <Table.Th>操作</Table.Th>
            </Table.Tr>
          </Table.Thead> */}
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    );
  });

  return (
    <>
      {/* <Searchbar />
      <Divider my="md" /> */}
      {/* <ActionIcon variant="light" aria-label="修改">
        <IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon> */}
      <Group justify="space-between">
        <Title order={2} size={'h4'}>
          {ctx.title}
        </Title>
        <Button
          variant="light"
          leftSection={<IconPlus size={16} />}
          size="xs"
          onClick={() => addOrUpdateUserModalRef.current?.open()}
        >
          添加
        </Button>
      </Group>
      <Divider my="md" />
      {renderTable()}
      <AddOrUpdateUserModal ref={addOrUpdateUserModalRef} />
    </>
  );
}
