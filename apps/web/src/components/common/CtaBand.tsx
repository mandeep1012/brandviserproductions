import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eyebrow } from './Eyebrow';
import { GoldRule, Section } from './Section';

interface CtaBandProps {
  title: string;
  text: string;
  href: string;
  label: string;
}

/** Closing navy band on every page: headline and one gold primary action. */
export function CtaBand({ title, text, href, label }: CtaBandProps) {
  return (
    <>
      <Section tone="navy" spacing="compact" className="md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Eyebrow rule className="mb-2 md:mb-3">
              Start a project
            </Eyebrow>
            <h2 className="text-h2">{title}</h2>
            <p className="text-small mt-2 text-slate md:mt-3">{text}</p>
          </div>
          <Button asChild variant="gold" className="w-full md:w-auto">
            <Link href={href}>{label}</Link>
          </Button>
        </div>
      </Section>
      <GoldRule />
    </>
  );
}
