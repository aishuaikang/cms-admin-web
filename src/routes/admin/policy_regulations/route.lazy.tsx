import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/admin/policy_regulations')({
  component: PolicyRegulations,
});

function PolicyRegulations() {
  return <>政策法规</>;
}
