import { getCategoryListQueryOptions } from '@/apis/category';
import { Select, SelectProps } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import ErrorComponent from './ErrorComponent';
import LoadingComponent from './LoadingComponent';

const CategorySelect: React.FC<SelectProps> = (props) => {
  const { isError, error, data, isFetching } = useQuery(
    getCategoryListQueryOptions()
  );

  if (isFetching) return <LoadingComponent />;

  if (isError)
    return <ErrorComponent title="获取分类列表失败" error={error.message} />;

  return (
    <Select
      label="分类"
      data={data?.map((category) => ({
        value: category.id,
        label: category.name,
      }))}
      description="用于区分文章的分类"
      placeholder="选择分类"
      {...props}
    />
  );
};

export default CategorySelect;
