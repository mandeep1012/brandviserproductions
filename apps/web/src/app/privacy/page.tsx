import type { Metadata } from 'next';
import { Section } from '@/components/common/Section';

export const metadata: Metadata = { title: 'Privacy policy', robots: { index: false } };

export default function PrivacyPage() {
  return (
    <Section className="max-w-3xl">
      <h1 className="text-h1 mb-6">Privacy policy</h1>
      <p>[Privacy policy to be supplied by BRANDVISER: what enquiry data is collected, why, how long it is kept, and how to request deletion.]</p>
    </Section>
  );
}
