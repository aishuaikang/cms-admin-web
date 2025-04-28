import { Route as IndexRoute } from '@/routes/index/route';
import { createFileRoute, redirect } from '@tanstack/react-router';
import NotFoundComponent from '@/components/NotFoundComponent';

export const Route = createFileRoute('/admin')({
  context: () => ({ title: '管理后台' }),
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: IndexRoute.to,
      });
    }
  },
  notFoundComponent: NotFoundComponent,
});
