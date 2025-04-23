import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/users')({
  context: () => ({ title: '用户管理' }),
});
