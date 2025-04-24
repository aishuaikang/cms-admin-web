import { forwardRef, useImperativeHandle, useState } from 'react';
import { Tag } from '@/apis/tag/types';
import { useModalsStack } from '@mantine/core';
import { useMemoizedFn } from 'ahooks';
import CommonModal from '@components/CommonModal';
import AddOrUpdateTagModalChildren from './chidlren';

export interface AddOrUpdateTagModalRef {
  open: (currentTag?: Tag) => void;
  close: () => void;
}

const AddOrUpdateTagModal = forwardRef<AddOrUpdateTagModalRef>((_, ref) => {
  const stack = useModalsStack(['AddOrUpdateTagModal']);

  const [currentTag, setCurrentTag] = useState<Tag>();

  const open = useMemoizedFn<AddOrUpdateTagModalRef['open']>((currentTag) => {
    stack.open('AddOrUpdateTagModal');

    setCurrentTag(currentTag);
  });

  const close = useMemoizedFn<AddOrUpdateTagModalRef['close']>(() => {
    stack.close('AddOrUpdateTagModal');
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
      title={currentTag ? '修改标签' : '添加标签'}
      {...stack.register('AddOrUpdateTagModal')}
    >
      <AddOrUpdateTagModalChildren
        onClose={() => stack.close('AddOrUpdateTagModal')}
        currentTag={currentTag}
      />
    </CommonModal>
  );
});
export default AddOrUpdateTagModal;
