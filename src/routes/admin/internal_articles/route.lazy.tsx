import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/admin/internal_articles')({
  component: InternalArticles,
});

function InternalArticles() {
  return <>内部新闻</>;
}
