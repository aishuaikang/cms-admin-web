import { Alert } from '@mantine/core';

const ErrorComponent: React.FC<{ title?: string; error: string }> = ({
  title,
  error,
}) => {
  return (
    <Alert title={title} color="red">
      {error}
    </Alert>
  );
};

export default ErrorComponent;
