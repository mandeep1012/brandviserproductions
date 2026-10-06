import type { Faq } from '@brandviserproductions/contracts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

/** Two columns of questions on desktop, one on mobile. Each column is its own accordion. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  const half = Math.ceil(faqs.length / 2);
  const columns = [faqs.slice(0, half), faqs.slice(half)];
  return (
    <div className="grid md:grid-cols-2 md:gap-x-12">
      {columns.map((column, index) => (
        <Accordion key={index} type="multiple" className="border-rule md:border-b-0">
          {column.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border-t border-b-0 border-rule">
              <AccordionTrigger className="min-h-14 py-4 text-[17px] font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-small whitespace-pre-line text-slate">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ))}
    </div>
  );
}
