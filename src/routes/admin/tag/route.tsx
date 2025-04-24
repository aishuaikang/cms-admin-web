import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/tag')({
  context: () => ({ title: '标签管理' }),
});
