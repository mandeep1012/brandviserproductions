import Link from 'next/link';
import type { ProcessStep } from '@brandviserproductions/contracts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

/** Home: four columns with brass numerals; a vertical list on mobile. */
export function ProcessStepsCompact({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-4 md:gap-6">
      {steps.map((step) => (
        <li
          key={step.id}
          className="flex items-baseline gap-4 border-t border-rule pt-4 md:flex-col md:gap-2 md:border-ink md:pt-6"
        >
          <span className="w-10 flex-none font-serif text-[30px] leading-9 text-brass md:text-[40px] md:leading-[46px]">
            {step.number}
          </span>
          <span className="flex flex-col gap-1 md:gap-2">
            <span className="text-h3">{step.name}</span>
            <span className="text-small text-slate">{step.line}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Expertise: a one-line strip of step names. */
export function ProcessStrip({ steps }: { steps: ProcessStep[] }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-12">
      <p className="eyebrow w-36 flex-none text-slate">How we work</p>
      <ol className="grid flex-grow md:grid-cols-4 md:gap-6">
        {steps.map((step) => (
          <li
            key={step.id}
            className="flex min-h-13 items-center gap-4 border-t border-rule md:block md:min-h-0 md:border-ink md:pt-3"
          >
            <span className="eyebrow text-slate">{step.number}</span>
            <p className="font-semibold">{step.name}</p>
          </li>
        ))}
      </ol>
      <Link href="/about#process" className="flex min-h-11 flex-none items-center text-[16px] md:text-[15px]">
        Our process →
      </Link>
    </div>
  );
}

function StepFacts({ step }: { step: ProcessStep }) {
  return (
    <>
      <div className="border-t border-rule pt-3">
        <p className="eyebrow text-slate">You get</p>
        <p className="text-[15px] leading-6 font-semibold">{step.deliverable}</p>
      </div>
      {step.duration && (
        <div className="border-t border-rule pt-3">
          <p className="eyebrow text-slate">Typical time</p>
          <p className="text-[15px] leading-6">{step.duration}</p>
        </div>
      )}
    </>
  );
}

/** About & Process: full detail. Four columns on desktop, an accordion (first open) on mobile. */
export function ProcessStepsDetailed({ steps }: { steps: ProcessStep[] }) {
  return (
    <>
      <ol className="hidden grid-cols-4 gap-6 md:grid">
        {steps.map((step) => (
          <li key={step.id} className="flex flex-col gap-2.5 border-t border-ink pt-6">
            <span className="font-serif text-[56px] leading-[60px] text-brass">{step.number}</span>
            <h3 className="text-h3">{step.name}</h3>
            <p className="text-small min-h-20 text-slate">{step.detail}</p>
            <StepFacts step={step} />
          </li>
        ))}
      </ol>
      <Accordion
        type="single"
        collapsible
        defaultValue={steps[0]?.id}
        className="border-l border-ink pl-4 md:hidden"
      >
        {steps.map((step) => (
          <AccordionItem key={step.id} value={step.id} className="border-t border-b-0 border-rule last:border-b">
            <AccordionTrigger className="min-h-14 items-center gap-4 py-2 hover:no-underline">
              <span className="flex items-center gap-4">
                <span className="font-serif text-[30px] leading-9 font-normal text-brass">{step.number}</span>
                <span className="text-h3">{step.name}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-3">
              <p className="text-small text-slate">{step.detail}</p>
              <StepFacts step={step} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
