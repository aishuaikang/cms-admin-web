import {
  addImageMutationFn,
  deleteImageMutationFn,
  getImageListQueryOptions,
  IMAGE_LIST_QUERY_KEY,
} from '@/apis/image';
import { Route as AdminImageRoute } from '@/routes/admin/image/route';
import {
  Button,
  Divider,
  FileButton,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useRouteContext } from '@tanstack/react-router';
import { useMemoizedFn } from 'ahooks';
import EmptyComponent from '@/components/EmptyComponent';
import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';

export const Route = createLazyFileRoute('/admin/image')({
  component: Image,
});

function Image() {
  const ctx = useRouteContext({ from: AdminImageRoute.to });

  const { isError, error, data, isFetching } = useQuery(
    getImageListQueryOptions()
  );

  const { mutateAsync: deleteImageMutation } = useMutation({
    mutationFn: deleteImageMutationFn,
    onMutate: () => {
      return notifications.show({
        loading: true,
        message: '请稍等片刻，正在删除图片',
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: (_data, _var, context) => {
      notifications.update({
        id: context,
        color: 'green',
        message: '删除图片成功',
        loading: false,
        autoClose: 2000,
      });

      ctx.queryClient.invalidateQueries({
        queryKey: [IMAGE_LIST_QUERY_KEY],
      });
    },
    onError: (error, _var, context) => {
      notifications.update({
        id: context,
        color: 'red',
        title: '删除图片失败',
        message: error.message,
        loading: false,
        autoClose: 2000,
      });
    },
  });

  const renderImages = useMemoizedFn(() => {
    if (isFetching) return <LoadingComponent />;

    if (isError)
      return <ErrorComponent title="获取图片列表失败" error={error.message} />;

    if (data?.length === 0) return <EmptyComponent />;

    return (
      <ScrollArea
        h={'calc(100% - 30px - 33px)'}
        className="[&>.mantine-ScrollArea-scrollbar]:z-[3]"
      >
        <Group>
          <Group align="center" style={{ flexWrap: 'wrap' }}>
            {data?.map((image) => (
              <div key={image.id} className="w-[200px] relative group">
                <img
                  src={
                    import.meta.env.VITE_BASE_API +
                    `/common/image/download/${image.id}?${new Date().getTime()}`
                  }
                  alt={image.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Stack align={'center'} justify={'space-between'} mt="xs">
                  {/* <Text size="sm">{image.title}</Text> */}
                  <Group align="center" justify="space-between" w={'100%'}>
                    <Text size="xs" c="dimmed">
                      {image.users.length} 个用户使用
                    </Text>
                    <Text size="xs" c="dimmed">
                      {image.articles.length} 篇文章使用
                    </Text>
                  </Group>
                </Stack>

                <Button
                  className="!absolute top-2 right-2 !hidden group-hover:!block"
                  size="xs"
                  color="red"
                  //   variant="light"
                  onClick={() => {
                    modals.openConfirmModal({
                      title: '删除图片',
                      centered: true,
                      children: (
                        <Text size="sm">
                          你确定要删除这个图片吗？这将无法恢复。
                        </Text>
                      ),
                      labels: {
                        confirm: '删除',
                        cancel: '取消',
                      },
                      confirmProps: { color: 'red' },
                      onConfirm: () => deleteImageMutation(image.id),
                    });
                  }}
                >
                  删除
                </Button>
              </div>
            ))}
          </Group>
        </Group>
      </ScrollArea>
    );
  });

  const { mutateAsync: addImageMutation } = useMutation({
    mutationFn: addImageMutationFn,
    onMutate: () => {
      return notifications.show({
        loading: true,
        message: '请稍等片刻，正在上传图片',
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: (_data, _var, context) => {
      notifications.update({
        id: context,
        color: 'green',
        message: '上传图片成功',
        loading: false,
        autoClose: 2000,
      });

      ctx.queryClient.invalidateQueries({
        queryKey: [IMAGE_LIST_QUERY_KEY],
      });
    },
    onError: (error, _var, context) => {
      notifications.update({
        id: context,
        color: 'red',
        title: '上传图片失败',
        message: error.message,
        loading: false,
        autoClose: 2000,
      });
    },
  });

  const handleFileChange = async (newFile: File) => {
    const formData = new FormData();
    formData.append('image', newFile);

    await addImageMutation(formData);
  };

  return (
    <>
      <Group justify="space-between">
        <Title order={2} size={'h4'}>
          {ctx.title}
        </Title>

        <FileButton
          onChange={(newFile) => {
            newFile && handleFileChange(newFile);
          }}
          accept="image/png,image/jpeg"
        >
          {(props) => (
            <Button
              {...props}
              variant="light"
              leftSection={<IconPlus size={16} />}
              size="xs"
            >
              添加
            </Button>
          )}
        </FileButton>
      </Group>
      <Divider my="md" />
      {renderImages()}
    </>
  );
}
