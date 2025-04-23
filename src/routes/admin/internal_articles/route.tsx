import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/internal_articles')({
  context: () => ({ title: '内部新闻' }),
});
