import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/category')({
  context: () => ({ title: '分类管理' }),
});
