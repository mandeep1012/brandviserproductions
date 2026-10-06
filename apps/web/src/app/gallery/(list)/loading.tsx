import { PageSkeleton } from '@/components/common/PageSkeleton';

export default function Loading() {
  return <PageSkeleton hero="stacked" cards={6} />;
}
