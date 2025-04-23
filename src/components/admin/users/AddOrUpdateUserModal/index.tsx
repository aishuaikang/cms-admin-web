import { forwardRef, useImperativeHandle, useState } from 'react';
import { User } from '@/apis/user/types';
import { useModalsStack } from '@mantine/core';
import { useMemoizedFn } from 'ahooks';
import CommonModal from '@components/CommonModal';
import AddOrUpdateArticleModalChildren from './chidlren';

export interface AddOrUpdateUserModalRef {
  open: (currentUser?: User) => void;
  close: () => void;
}

const AddOrUpdateUserModal = forwardRef<AddOrUpdateUserModalRef>((_, ref) => {
  const stack = useModalsStack(['AddOrUpdateUserModal']);

  const [currentUser, setCurrentUser] = useState<User>();

  const open = useMemoizedFn<AddOrUpdateUserModalRef['open']>((currentUser) => {
    stack.open('AddOrUpdateUserModal');

    setCurrentUser(currentUser);
  });

  const close = useMemoizedFn<AddOrUpdateUserModalRef['close']>(() => {
    stack.close('AddOrUpdateUserModal');
  });

  useImperativeHandle(
    ref,
    () => ({
      open,
      close,
    }),
    [close, open]
  );

  return (
    <CommonModal
      title={currentUser ? '修改用户' : '添加用户'}
      {...stack.register('AddOrUpdateUserModal')}
    >
      <AddOrUpdateArticleModalChildren
        onClose={() => stack.close('AddOrUpdateUserModal')}
        currentUser={currentUser}
      />
    </CommonModal>
  );
});
export default AddOrUpdateUserModal;
