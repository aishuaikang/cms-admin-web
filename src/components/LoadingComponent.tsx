import { Center, Loader } from '@mantine/core';

const LoadingComponent = () => {
  return (
    <Center h={100}>
      <Loader color="blue" type="dots" size="lg" />
    </Center>
  );
};
export default LoadingComponent;
