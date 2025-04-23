import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/')({
  context: () => ({ title: '后台首页' }),
});
