import { forwardRef, useImperativeHandle, useState } from 'react';
import { Category } from '@/apis/category/types';
import { useModalsStack } from '@mantine/core';
import { useMemoizedFn } from 'ahooks';
import CommonModal from '@components/CommonModal';
import AddOrUpdateCategoryModalChildren from './chidlren';

export interface AddOrUpdateCategoryModalRef {
  open: (currentCategory?: Category) => void;
  close: () => void;
}

const AddOrUpdateCategoryModal = forwardRef<AddOrUpdateCategoryModalRef>(
  (_, ref) => {
    const stack = useModalsStack(['AddOrUpdateCategoryModal']);

    const [currentCategory, setCurrentCategory] = useState<Category>();

    const open = useMemoizedFn<AddOrUpdateCategoryModalRef['open']>(
      (currentCategory) => {
        stack.open('AddOrUpdateCategoryModal');

        setCurrentCategory(currentCategory);
      }
    );

    const close = useMemoizedFn<AddOrUpdateCategoryModalRef['close']>(() => {
      stack.close('AddOrUpdateCategoryModal');
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
        title={currentCategory ? '修改分类' : '添加添加分类'}
        {...stack.register('AddOrUpdateCategoryModal')}
      >
        <AddOrUpdateCategoryModalChildren
          onClose={() => stack.close('AddOrUpdateCategoryModal')}
          currentCategory={currentCategory}
        />
      </CommonModal>
    );
  }
);
export default AddOrUpdateCategoryModal;
