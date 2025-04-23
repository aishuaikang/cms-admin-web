import { Center, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconMoodPuzzled } from '@tabler/icons-react';

const NotFoundComponent = () => (
  <Center h={300}>
    <Stack align="center">
      <ThemeIcon size={80} radius="xl" variant="light" color="gray">
        <IconMoodPuzzled size={50} stroke={1.5} />
      </ThemeIcon>
      <Text size="lg" fw={500} c="dimmed">
        404 Not Found
      </Text>
    </Stack>
  </Center>
);

export default NotFoundComponent;
