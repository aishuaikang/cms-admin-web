import { addImageMutationFn } from '@/apis/image';
import { Avatar, Button, FileButton, Group, Image, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';

export interface UploadImageProps {
  type: 'avatar' | 'image';
  value: string | null;
  onChange: (value: string | null) => void;
}
const UploadImage: React.FC<UploadImageProps> = ({ type, value, onChange }) => {
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
    onSuccess: (data, _var, context) => {
      notifications.update({
        id: context,
        color: 'green',
        message: '上传图片成功',
        loading: false,
        autoClose: 2000,
      });
      onChange(data.at(0)?.id || null);
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
    onChange(newFile.name);

    const formData = new FormData();
    formData.append('image', newFile);

    await addImageMutation(formData);
  };
  return (
    <Stack>
      <Group justify="center">
        {type === 'avatar' ? (
          <Avatar
            size={80}
            src={
              value
                ? import.meta.env.VITE_BASE_API +
                  `/common/image/download/${value}?${new Date().getTime()}`
                : undefined
            }
            radius={40}
          />
        ) : (
          <Image
            radius="md"
            src={
              value
                ? import.meta.env.VITE_BASE_API +
                  `/common/image/download/${value}?${new Date().getTime()}`
                : undefined
            }
            fallbackSrc="https://placehold.co/600x400?text=Image"
          />
        )}

        {/*  */}
      </Group>
      <Group justify="center">
        <FileButton
          onChange={(newFile) => {
            newFile && handleFileChange(newFile);
          }}
          accept="image/*"
        >
          {(props) => <Button {...props}>上传</Button>}
        </FileButton>
      </Group>
    </Stack>
  );
};
export default UploadImage;
