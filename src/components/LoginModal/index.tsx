import { forwardRef, useImperativeHandle } from 'react';
import { Group, Title } from '@mantine/core';
import {
  isShowLoginModalStore,
  setIsShowLoginModalStore,
} from '@store/isShowLoginModalStore';
import { IconArticle } from '@tabler/icons-react';
import { useStore } from '@tanstack/react-store';
import CommonModal from '@components/CommonModal';
import LoginModalChildren from './children';

export interface LoginModalRef {
  open: () => void;
  close: () => void;
}

const LoginModal = forwardRef<LoginModalRef>((_, ref) => {
  const isShowLoginModal = useStore(isShowLoginModalStore);

  const open = () => setIsShowLoginModalStore(true);
  const close = () => setIsShowLoginModalStore(false);

  useImperativeHandle(
    ref,
    () => ({
      open,
      close,
    }),
    []
  );

  return (
    <CommonModal
      opened={isShowLoginModal}
      onClose={close}
      closeOnClickOutside={false}
      title={
        <Group>
          <IconArticle size={24} />
          <Title order={4}>用户登录</Title>
        </Group>
      }
    >
      <LoginModalChildren onClose={close} />
    </CommonModal>
  );
});

export default LoginModal;
