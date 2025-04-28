import { Center, Container, Stack, Text, Title } from '@mantine/core';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/admin/')({
  component: Index,
});
function Index() {
  return (
    <Container size="lg" style={{ height: '100%' }}>
      <Center style={{ height: '100%' }}>
        <Stack align="center">
          <Title order={2}>欢迎来到管理后台</Title>
          <Text size="md" color="dimmed">
            这里是管理后台首页。
          </Text>
          {/* <Card
            shadow="sm"
            padding="lg"
            style={{ width: '100%', maxWidth: 600 }}
          >
            <Text color="dimmed">暂无内容，请根据需求添加模块。</Text>
          </Card> */}
        </Stack>
      </Center>
    </Container>
  );
}
