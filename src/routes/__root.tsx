import { AuthContext } from '@contexts/auth';
import '@mantine/carousel/styles.css';
import { QueryClient } from '@tanstack/react-query';
import { Outlet } from '@tanstack/react-router';
import { createRootRouteWithContext } from '@tanstack/react-router';
import NotFoundComponent from '@/components/NotFoundComponent';
import Layout from '@components/AdminLayout';
import useAutoSetTitle from '@hooks/useAutoSetTitle';

const Root = () => {
  useAutoSetTitle();

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

interface RouterContext {
  title?: string;
  queryClient: QueryClient;
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Root />,
  notFoundComponent: NotFoundComponent,

  //   afterLoad: async () => {
  //     nprogress.complete();
  //   },
});
