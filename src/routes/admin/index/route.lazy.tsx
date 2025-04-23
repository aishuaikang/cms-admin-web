import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/admin/')({
  component: Index,
});

function Index() {
  return (
    <>
      <p>基本信息</p>
    </>
  );
}
