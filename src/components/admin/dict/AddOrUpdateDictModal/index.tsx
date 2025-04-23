import { forwardRef, useImperativeHandle, useState } from 'react';
import { Dict } from '@/apis/dict/types';
import { useModalsStack } from '@mantine/core';
import { useMemoizedFn } from 'ahooks';
import CommonModal from '@components/CommonModal';
import AddOrUpdateDictModalChildren from './chidlren';

export interface AddOrUpdateDictModalRef {
  open: (isEdit: boolean, currentDict?: Dict) => void;
  close: () => void;
}

const AddOrUpdateDictModal = forwardRef<AddOrUpdateDictModalRef>((_, ref) => {
  const stack = useModalsStack(['AddOrUpdateDictModal']);

  const [currentDict, setCurrentDict] = useState<Dict>();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const open = useMemoizedFn<AddOrUpdateDictModalRef['open']>(
    (isEdit, currentDict) => {
      stack.open('AddOrUpdateDictModal');

      setIsEdit(isEdit);

      setCurrentDict(currentDict);
    }
  );

  const close = useMemoizedFn<AddOrUpdateDictModalRef['close']>(() => {
    stack.close('AddOrUpdateDictModal');
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
      title={
        isEdit
          ? `修改 ${currentDict?.name} 字典`
          : currentDict
          ? `添加子字典`
          : '添加顶级字典'
      }
      {...stack.register('AddOrUpdateDictModal')}
    >
      <AddOrUpdateDictModalChildren
        onClose={() => stack.close('AddOrUpdateDictModal')}
        currentDict={currentDict}
        isEdit={isEdit}
      />
    </CommonModal>
  );
});
export default AddOrUpdateDictModal;
