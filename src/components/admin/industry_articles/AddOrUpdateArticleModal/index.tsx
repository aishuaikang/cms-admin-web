import { forwardRef, useImperativeHandle, useState } from 'react';
import { Article } from '@/apis/articles/types';
import { useModalsStack } from '@mantine/core';
import { useMemoizedFn } from 'ahooks';
import CommonModal from '@components/CommonModal';
import AddOrUpdateArticleModalChildren from './chidlren';

export interface AddOrUpdateArticleModalRef {
  open: (currentArticle?: Article) => void;
  close: () => void;
}

const AddOrUpdateArticleModal = forwardRef<AddOrUpdateArticleModalRef>(
  (_, ref) => {
    const stack = useModalsStack(['AddOrUpdateArticleModal']);

    const [currentArticle, setCurrentArticle] = useState<Article>();

    const open = useMemoizedFn<AddOrUpdateArticleModalRef['open']>(
      (currentArticle) => {
        stack.open('AddOrUpdateArticleModal');

        setCurrentArticle(currentArticle);
      }
    );

    const close = useMemoizedFn<AddOrUpdateArticleModalRef['close']>(() => {
      stack.close('AddOrUpdateArticleModal');
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
        title={currentArticle ? '编辑文章' : '添加文章'}
        {...stack.register('AddOrUpdateArticleModal')}
      >
        <AddOrUpdateArticleModalChildren
          onClose={() => stack.close('AddOrUpdateArticleModal')}
          currentArticle={currentArticle}
        />
      </CommonModal>
    );
  }
);
export default AddOrUpdateArticleModal;
