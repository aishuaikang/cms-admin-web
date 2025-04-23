import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/policy_regulations')({
  context: () => ({ title: '政策法规' }),
});
