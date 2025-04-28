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
      data={data?.map((category) => ({
        value: category.id,
        label: category.name,
      }))}
      {...props}
    />
  );
};

export default CategorySelect;
