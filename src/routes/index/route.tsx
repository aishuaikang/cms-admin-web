import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  context: () => ({ title: '首页' }),
});
