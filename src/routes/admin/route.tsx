import { Route as IndexRoute } from '@/routes/admin/route';
import { createFileRoute, redirect } from '@tanstack/react-router';
import NotFoundComponent from '@/components/NotFoundComponent';

export const Route = createFileRoute('/admin')({
  context: () => ({ title: '管理后台' }),
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: IndexRoute.to,
        search: {
          redirect: location.href,
        },
      });
    }
  },
  notFoundComponent: NotFoundComponent,
});
