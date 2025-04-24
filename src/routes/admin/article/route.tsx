import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/article')({
  context: () => ({ title: '文章管理' }),
});
