import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/image')({
  context: () => ({ title: '图片管理' }),
});
