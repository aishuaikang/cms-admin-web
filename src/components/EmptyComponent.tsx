import { Alert } from '@mantine/core';
import { IconDatabaseOff } from '@tabler/icons-react';

const EmptyComponent = () => {
  return (
    <Alert
      variant="light"
      color="gray"
      title="没有数据"
      icon={<IconDatabaseOff />}
    ></Alert>
  );
};

export default EmptyComponent;
