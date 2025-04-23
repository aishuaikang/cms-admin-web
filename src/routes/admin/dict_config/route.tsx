import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/dict_config')({
  context: () => ({ title: '字典配置' }),
});
