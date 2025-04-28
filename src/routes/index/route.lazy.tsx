import { Center, Container, Stack, Text, Title } from '@mantine/core';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <Container
      size="md"
      h={'calc(100vh - 76px - 16px)'}
      style={{ height: '100vh' }}
    >
      <Center style={{ height: '100%' }}>
        <Stack align="center">
          <Title order={1}>欢迎来到 CMS 管理系统</Title>
          <Text size="lg" color="dimmed">
            一个高效、现代化的内容管理系统，助您轻松管理内容。
          </Text>
        </Stack>
      </Center>
    </Container>
  );
}
