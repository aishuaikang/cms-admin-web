import { lazy, Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '@/styles/_keyframe-animations.scss';
import '@/styles/_variables.scss';
import { AuthProvider, useAuth } from '@contexts/auth';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { NavigationProgress } from '@mantine/nprogress';
import '@mantine/nprogress/styles.css';
import '@mantine/tiptap/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import './style.css';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
  //   defaultPreload: 'intent',
  //   // Since we're using React Query, we don't want loader calls to ever be stale
  //   // This will ensure that the loader is always called when the route is preloaded or visited
  //   defaultPreloadStaleTime: 0,
  //   scrollRestoration: true,
});
const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/production').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

const App = () => {
  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    Reflect.set(window, 'toggleDevtools', () => setShowDevtools((old) => !old));
  }, []);

  const auth = useAuth();

  return (
    <>
      <MantineProvider defaultColorScheme="light">
        <NavigationProgress />
        <Notifications position="top-center" limit={3} />
        <ModalsProvider>
          <RouterProvider router={router} context={{ auth }} />
        </ModalsProvider>
      </MantineProvider>
      {(process.env.NODE_ENV !== 'production' || showDevtools) && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      )}
      <Suspense>
        <TanStackRouterDevtools router={router} />
      </Suspense>
    </>
  );
};

const rootElement = document.getElementById('root') as HTMLElement;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  );
}
