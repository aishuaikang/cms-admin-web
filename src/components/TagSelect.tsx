import { getTagListQueryOptions } from '@/apis/tag';
import { MultiSelect, MultiSelectProps } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import ErrorComponent from './ErrorComponent';
import LoadingComponent from './LoadingComponent';

const TagSelect: React.FC<MultiSelectProps> = (props) => {
  const { isError, error, data, isFetching } = useQuery(
    getTagListQueryOptions()
  );

  if (isFetching) return <LoadingComponent />;

  if (isError)
    return <ErrorComponent title="获取标签列表失败" error={error.message} />;

  return (
    <MultiSelect
      label="标签"
      variant="filled"
      data={data?.map((tag) => ({
        value: tag.id,
        label: tag.name,
      }))}
      placeholder="选择标签"
      {...props}
    />
  );
};

export default TagSelect;
