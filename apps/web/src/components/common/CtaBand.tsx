import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Section } from './Section';

interface CtaBandProps {
  title: string;
  text: string;
  href: string;
  label: string;
}

/** Closing band on every page: headline and one primary action. */
export function CtaBand({ title, text, href, label }: CtaBandProps) {
  return (
    <Section tone="white" spacing="compact" className="border-b-0 md:py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-h2">{title}</h2>
          <p className="text-small mt-2 text-slate md:mt-3">{text}</p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link href={href} className="text-primary-foreground hover:text-primary-foreground">
            {label}
          </Link>
        </Button>
      </div>
    </Section>
  );
}
