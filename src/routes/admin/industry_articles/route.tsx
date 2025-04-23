import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/industry_articles')({
  context: () => ({ title: '行业新闻' }),
});
