import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="gutter flex flex-col items-start gap-6 py-16 md:py-32">
      <p className="eyebrow text-slate">404</p>
      <h1 className="text-h1 max-w-2xl">This page isn&apos;t here.</h1>
      <p className="max-w-xl">It may have moved, or the link may be mistyped.</p>
      <div className="flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/">Go to the home page</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/gallery">See our work</Link>
        </Button>
      </div>
    </section>
  );
}
