import type { Metadata } from 'next';
import { Section } from '@/components/common/Section';

export const metadata: Metadata = { title: 'Terms', robots: { index: false } };

export default function TermsPage() {
  return (
    <Section className="max-w-3xl">
      <h1 className="text-h1 mb-6">Terms</h1>
      <p>[Website terms of use to be supplied by BRANDVISER.]</p>
    </Section>
  );
}
