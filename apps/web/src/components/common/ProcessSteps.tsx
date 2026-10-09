import type { ProcessStep } from '@brandviserproductions/contracts';

/** Home (on a midnight band): four columns with gold numerals; a vertical list on mobile. */
export function ProcessStepsCompact({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-4 md:gap-6">
      {steps.map((step) => (
        <li
          key={step.id}
          className="flex items-baseline gap-4 border-t border-rule pt-4 md:flex-col md:gap-2 md:border-gold-500 md:pt-6"
        >
          <span className="w-11 flex-none font-serif text-[36px] leading-10 text-metal md:w-auto md:self-start md:text-[56px] md:leading-[60px]">
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
      <p className="eyebrow eyebrow-rule w-36 flex-none text-eyebrow">How we work</p>
      <ol className="grid flex-grow md:grid-cols-4 md:gap-6">
        {steps.map((step) => (
          <li
            key={step.id}
            className="flex min-h-13 items-center gap-4 border-t border-rule md:block md:min-h-0 md:border-gold-500 md:pt-3"
          >
            <span className="eyebrow text-gold-700">{step.number}</span>
            <p className="font-semibold">{step.name}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
