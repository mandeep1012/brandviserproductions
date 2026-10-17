import type { Faq } from '@brandviserproductions/contracts';
import { Eyebrow } from '@/components/common/Eyebrow';

/**
 * Contact: the FAQs as an editorial list, every answer open so nothing hides behind a click.
 * Desktop reads across each row (number, question, answer); phones stack them.
 */
export function ContactFaqs({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <div className="flex flex-col gap-3">
        <Eyebrow rule>FAQs</Eyebrow>
        <h2 className="text-h2">
          Questions clients <em className="text-metal">ask.</em>
        </h2>
      </div>
      <dl className="border-b border-rule">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="grid gap-3 border-t border-rule py-7 md:py-9 lg:grid-cols-12 lg:items-baseline lg:gap-6"
          >
            <dt className="flex items-baseline gap-3 lg:col-span-5">
              <span aria-hidden className="eyebrow w-6 shrink-0 text-gold-700">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-serif text-[22px] leading-7 text-navy md:text-2xl md:leading-8">{faq.question}</span>
            </dt>
            <dd className="pl-9 text-[15px] leading-7 whitespace-pre-line text-slate md:text-base lg:col-span-7 lg:pl-0">
              {faq.answer}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
